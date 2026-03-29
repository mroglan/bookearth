# BE-11: Event Extraction Pipeline

## Context

Book Earth needs a way to populate the map with events for a given book. Currently, seed data is hand-crafted SQL (20 events for "Around the World in 80 Days"). We need an automated pipeline that takes a book's `.txt` file and produces structured events with locations, descriptions, and importance scores.

The long-term vision is a **feedback loop**: extract → visualize → human edits → retrain → repeat. Human feedback specifically improves importance scoring (Model 2) and location mapping (Model 3), so the system gets better with use.

## Architecture: Three Models

```
book.txt
  → [Model 1: Event Extraction]  →  raw events (description, physical location, text position)
  → [Model 2: Importance Scoring] →  events with importance (0-1)
  → [Model 3: Geocoding]          →  events with lat/lon
  → output JSON / DB insert
```

Each model has a distinct concern and a distinct feedback path.

---

### Model 1: Event Extraction

**Purpose:** Extract a list of events from the book text. No scoring, no coordinates — just find what happens and where.

**Input:** book `.txt` file

**Output per event:**
- `title` — short label (e.g., "Departure from the Reform Club")
- `description` — what happens at this event
- `physical_location` — the place name as it appears in the text (e.g., "the Reform Club", "Allahabad station", "the Carnatic")
- `text_position` — character offset or paragraph index in the source text (for traceability and narrative ordering)

**Approach:** NLP-based using spaCy:
- Run NER to find location entities (GPE, LOC, FAC)
- For each location mention, extract surrounding sentence(s) as context
- Group co-located mentions and select the most narratively significant passage
- Deduplicate (e.g., "London" appearing 50 times becomes a smaller set of distinct events at that location)

**Why not an LLM API:** Avoids cost, latency, and context-window constraints. NER is deterministic, fast, and sufficient for finding *where things happen*. The narrative understanding comes from Model 2.

**Dependencies:** `spacy`, `en_core_web_sm` (or `en_core_web_trf` for better accuracy)

---

### Model 2: Importance Scoring (Fine-tuned Transformer)

**Purpose:** Given the raw events from Model 1 and the full book text, assign importance (0-1) to each event. This determines what shows on the map and how prominently.

**Input per event:**
- The event's surrounding text passage (a few sentences of context from the book)
- The event title and physical location
- Book-level metadata (total event count, position in narrative)

**Output:** An `importance` score (0-1, continuous):
- 1.0 = pivotal plot moment (Fogg's departure, the wager, the return)
- 0.5 = significant stop or scene
- 0.0 = briefly mentioned location

**Model:** Fine-tuned DistilBERT (or similar small transformer) for regression/classification on importance.

- **Base model:** `distilbert-base-uncased` (~66M params) — small enough for fast inference on CPU, trainable on a modest cloud GPU in minutes
- **Task framing:** Regression — input is the event passage, output is a continuous importance score (0-1).
- **Training framework:** Hugging Face `transformers` + `datasets` libraries

**Bootstrap (first run, no training data yet):**

Since we can't fine-tune without labeled data, the first run uses a heuristic to assign initial importance:
- Mention frequency (how often this location appears in the text)
- Text coverage (how many words/paragraphs are set at this location)
- Narrative position (events at start/end of book tend to matter more)
- Context signals (nearby words like "arrived", "departed", "discovered" vs. passing references)

This heuristic produces the first draft. The human reviews and corrects importance scores, generating the first batch of labeled training data.

**Retraining cycle:**
1. Human corrects importance scores → stored as `(passage_text, corrected_importance)` pairs
2. Fine-tune DistilBERT on the labeled data (cloud GPU — a few minutes per training run)
3. Re-run Model 2 with the fine-tuned model → better scores
4. Repeat as more feedback accumulates across books

**Training data format:**
```json
[
  {
    "text": "Phileas Fogg wagers twenty thousand pounds that he can circumnavigate the globe in eighty days, departing from the Reform Club.",
    "label": 1.0
  },
  {
    "text": "The train passed through the outskirts of Benares.",
    "label": 0.1
  }
]
```

**Cloud training:** A small DistilBERT fine-tune on ~50-200 examples runs in under 5 minutes on a single cloud GPU (e.g., a T4 on Google Colab, Lambda, or similar). No heavy infrastructure needed.

**Dependencies:** `transformers`, `datasets`, `torch`

---

### Model 3: Geocoding (Nominatim + Overrides)

**Purpose:** Map physical location names from the text to lat/lon coordinates on Earth.

**Input:** `physical_location` string from each event (e.g., "the Reform Club", "Suez", "Allahabad")

**Output:** `lat`, `lon` coordinates

**Approach:**
1. **Check overrides first** — a JSON file of hard-coded location mappings per book. This handles:
   - Fictional or ambiguous places
   - Locations Nominatim gets wrong (e.g., a tavern name that matches a city in the wrong country)
   - Human-corrected coordinates from the UI feedback loop
2. **Fall back to Nominatim** — free OpenStreetMap geocoding via `geopy`
   - Rate-limited (1 req/sec per Nominatim usage policy)
   - Cache results to avoid re-geocoding the same place name
3. **Log failures** — if neither override nor Nominatim resolves a location, log it for manual review

**Override file format** (`overrides/<book-slug>.json`):
```json
{
  "the Reform Club": { "lat": 51.5069, "lon": -0.1378 },
  "the Carnatic": null
}
```
- `null` value = skip this location (it's not a real place, e.g., a ship name misidentified as a location)
- When a human corrects a pin location in the UI, the correction gets written back to this file

**Dependencies:** `geopy`

---

## Human Feedback Loop

```
[Run pipeline] → [View on map] → [Human edits] → [Feedback feeds back]
                                        |
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
              Model 1 overrides  Model 2 retraining  Model 3 overrides
            (event corrections) (importance corrections) (location corrections)
```

### What the human reviews:
- Are the right events captured? (Model 1 quality)
- Are the importance scores right? (Model 2 quality)
- Are the pins in the right place? (Model 3 quality)
- Is the overall density good? (too many events? too few?)

### How feedback flows back:

**Importance corrections → Model 2:**
- Human changes an event's importance (e.g., 0.3 → 0.9, or removes a low-quality event)
- The `(passage_text, corrected_importance)` pair is stored as training data
- Fine-tune DistilBERT on the accumulated labeled data (cloud GPU)
- Re-run Model 2 with the fine-tuned model → better importance scores

**Location corrections → Model 3:**
- Human drags a pin to a new location
- The correction is written to the overrides JSON file: `"the Reform Club": { "lat": 51.5069, "lon": -0.1378 }`
- On re-run, the override takes precedence over Nominatim
- Overrides accumulate across runs and books, building a curated location database

**Event additions/removals → Model 1:**
- Human adds an event Model 1 missed → stored as a forced inclusion in a per-book overrides file
- Human removes a false positive → stored as a forced exclusion
- On re-run, the overrides inject/suppress events before Model 2 and 3 run

**Override file format** (`overrides/<book-slug>-events.json`):
```json
{
  "additions": [
    {
      "title": "Rescue of Aouda",
      "description": "Fogg and Passepartout rescue Aouda from a suttee ceremony.",
      "physical_location": "Pillaji",
      "text_position": 23456
    }
  ],
  "removals": [
    { "physical_location": "England", "reason": "too generic, not a distinct event" }
  ]
}
```
- Additions are merged into Model 1 output before passing to Model 2
- Removals filter out events matching by `physical_location` (or title)
- Over time, patterns in additions/removals could inform NER tuning (e.g., adjusting entity type filters or deduplication thresholds)

---

## Files to Create

```
scripts/
  extract_events/
    main.py            # CLI: python main.py <book.txt> -o events.json
    chunker.py         # Split book text into processable sections
    extractor.py       # Model 1: spaCy NER + context extraction
    scorer.py          # Model 2: heuristic bootstrap + fine-tuned DistilBERT inference
    train_scorer.py    # Model 2 training: fine-tune DistilBERT on human feedback data
    geocoder.py        # Model 3: Nominatim + overrides
    formatter.py       # Convert to event JSON / SQL insert
    requirements.txt   # spacy, geopy, transformers, datasets, torch
  overrides/
    around-the-world-in-eighty-days.json       # Location overrides
    around-the-world-in-eighty-days-events.json # Event overrides (additions/removals)
  training_data/
    importance_labels.json  # Human-corrected importance scores (accumulates over time)
  models/
    scorer/                 # Fine-tuned DistilBERT checkpoint (after first training run)
```

## Output Format

JSON matching the events table schema:
```json
[
  {
    "title": "Departure from the Reform Club",
    "description": "Phileas Fogg wagers twenty thousand pounds that he can travel around the world in eighty days.",
    "physical_location": "the Reform Club",
    "text_position": 1847,
    "lat": 51.5069,
    "lon": -0.1378,
    "importance": 0.95,
    "narrative_index": 1
  }
]
```

## BE-11 Implementation Scope

1. Build the three-model pipeline as a Python CLI
2. Run against "Around the World in Eighty Days" `.txt` (human will provide)
3. **Human reviews output** — evaluates events on the map and/or in JSON:
   - Are the right events captured?
   - Are importance scores producing good visual density?
   - Are pins in the right places?
4. **Feedback adjusts the system:**
   - Importance: correct scores → save to `training_data/importance_labels.json` → fine-tune DistilBERT → re-run Model 2
   - Locations: add entries to the location overrides JSON
   - Extraction: add entries to the event overrides JSON (additions/removals) + adjust NER parameters
5. **Re-run and repeat** until output quality is satisfactory

The prompt and parameters that emerge from this tuning become the baseline for future books.

## Dependencies

- `spacy` + `en_core_web_sm` — NER for event extraction (Model 1)
- `transformers` + `datasets` + `torch` — DistilBERT fine-tuning and inference (Model 2)
- `geopy` — Nominatim geocoding (Model 3)

## Verification

1. `cd scripts/extract_events && pip install -r requirements.txt && python -m spacy download en_core_web_sm`
2. `python main.py <path-to-around-the-world.txt> -o events.json`
3. Compare output against the 20 known locations in `003_seed.sql`
4. Load into DB, verify events render correctly on the globe
5. Iterate on feedback until human approves the extraction quality
