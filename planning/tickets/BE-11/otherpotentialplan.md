
# 🧭 The System in One Sentence

> **Generate events → visualize on a map → edit them → use edits to improve the model → repeat**

---

# 🧱 The 5-step loop

## 1. 🧠 Extract events (Model A)

* Input: chunk of book text
* Output: structured events

  * title
  * location (name)
  * importance

👉 This is your **first draft**

---

## 2. 🌍 Render on a map (system layer)

* Convert location → lat/lng (geocoder)
* Display:

  * pins on a globe
  * sized by importance
  * ordered as a path

👉 This turns text into something you can *see and judge*

---

## 🗺️ What the output feels like

![Image](https://images.openai.com/static-rsc-4/2i44HRS8DCWSDseNwlOnlEeswthdugEOLgq8PtidD5BItnygTLFnM9hnNtnCBokMEaFP5K3agwmO6jtj_aBrDWtlybA8P3ZPE9pHV2qwNYtocmCsmYnvePmaeVSS7nDW93OJoLv7C4Bpmh-nmYfg4W2-jG6F4TUv10TLa0VqmejOS1kBLtSsnci4268FXiPs?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/JJdkdI0IvdvY6zL3gUYaBcKhcBQPaS4AQhKQiFY0qi4RYgjp0OQSedOAyKDz73w6tuX98_9l_pAfwjNPgKw6NXjASitpbClCoTNVJNEl7ItwKfUvX73bUReeLXimYtUwMIZ1-SaPRtGztav8hOupkJtQqJqc_iiR5hUyi0syltmKeq8nh4FOf9dGFmfWwo-4?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/qhRkyzakkgGUPTFoBSZ6crBX5NaIcDCZuGjR3KWHbkjYLLO_3k8SNJLPbftnDuFKB5LM7fQvNGs9RWfYGiBQ-WpfltxNrQh6Cwiazglgdd0fS3pPu5L-E2kQqaBc_4BcQvfhTSvGXKQef7txqlbLZGTRybspVOIPpBI7Rx9Hjr_Lk2iIf7wwZe4O9yp6gfNN?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/lzcTV3_DT43oj3fNB2jj3nwcgaw7PKodkkxbwy4OzC4j7gGblxoG8QTaXh_nb8sUY8pJvkRmPEPfaBm3gaRCh5anFQbAU0DF984S5gvak9hl96bEpuisMgFrRp0q2BAHY77wG28wdGnqrZbkr5be3JfatMXf4UTyhHA8kU9fmXorr4AhAYCSzh4JIEVDyUSJ?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/osy-iNwBTpXXBNqE3hoW_vWJUj6Y8Zmz5qvRfNN_aB5JNtUD8HzfjWEo2OMmkJ-pW0lIEpgLZ4f_OCbLtlhDTjVeJ6bkUgl8xBCtbqtMjnI4JR3Vo8ai3lf3H_fXfq5EBS8GwIO-vAyGryJnB6wmO2oN0jhAkutgIEwrS_RB-4BQSQ37k5swyv_QsiHTd4os?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/FPyzaNV2a0jf77SWit6Gqe6iTauKv5IMSWP7L0wevRnIG_xQskrX0TkEPyBxnLyMG1T9AEJjttnYQ2cXzUgsC9QyoBeJmHHUllB01OTdFsKlSAyOU2iUJVWvVBwCFilw0Q19sh5zLgdqtBs0z3QIzpEPJDaZCuJPzURpWhH1krfN3pzz_cAxIOa8y2cqwwVb?purpose=fullsize)

---

## 3. ✏️ Edit in the UI (you = the teacher)

You interact directly with the map:

* move pins → fix location
* adjust importance → what matters
* edit descriptions → fix meaning
* add/remove events → completeness

👉 These edits are **structured feedback**, not just changes

---

## 4. 🔁 Refine (Model B)

* Input:

  * original text
  * original events
  * your edits

* Output:

  * improved, consistent event list

👉 This model learns:

* your definition of “event”
* your sense of importance
* how to fix mistakes

---

## 5. 🏋️ Retrain over time

* Store:

  * original → edited pairs
* Turn them into training data
* Fine-tune Model B periodically

👉 The system gets better **because you used it**

---

# 🔄 The loop (complete view)

```text
Text
  ↓
[Model A: Extract]
  ↓
Events
  ↓
[Map Visualization]
  ↓
[You Edit]
  ↓
Feedback (diffs)
  ↓
[Model B: Refine]
  ↓
Better Events
  ↓
(Stored as training data)
  ↓
[Fine-tune Model B]
  ↓
Repeat
```

---

# 🧠 Key architectural insight

* **Model A = generator (broad, creative, imperfect)**
* **Model B = refiner (precise, aligned to you)**

👉 You don’t try to make one model perfect
👉 You build a system that *converges* toward correctness

---

# 🏁 What you end up with

If you run this loop well:

* A **map-native interface for books**
* A **dataset of structured narrative events**
* A **model aligned to your taste and definitions**
