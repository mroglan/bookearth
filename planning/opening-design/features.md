# **Product Concept: Literary Map Explorer**

## **Overview**

The Literary Map Explorer is an interactive, Earth-based, 3D map experience for exploring events from books in a spatial and temporal context. Users navigate a **Google Earth–like environment** where key literary moments are anchored to real-world locations and revealed progressively based on zoom level and narrative structure.

The system emphasizes **visual immersion, curated storytelling, and geographic grounding**, ensuring every event is meaningful, visual, and spatially coherent.

---

# **Core User Experience**

### **Primary Interaction Loop**

1. User selects a book
2. A **3D Earth experience** loads, customized to the book
3. User zooms, rotates, and pans across the globe
4. Events appear dynamically based on zoom level
5. Clicking an event reveals:

   * Description
   * Passage excerpt
   * Illustration
   * Narrative context

---

# **Feature Area 1: Interactive Map System (3D Earth Experience)**

## **1.1 Google Earth–Like Navigation**

![Image](https://images.openai.com/static-rsc-4/azBC_8FFODzWVuUQofId8P_WkgCxnIURageJk1fSIItO1Al6_fHvgcJQq5p0IWZZ8Ta9Zbqz6zfKHkajCalLqG38HkjntngcrQc3stqmssyP0rKU2vtMMZ9DOAgutFDEaUBeclLT7YwugMhzooilEhxzhXSTF1vh-imXVJamBL-RHtigs5L4onhsBce-7Hn_?purpose=fullsize)

The map is not a flat 2D interface — it is a **fully navigable 3D globe**.

### Core Capabilities:

* Smooth zoom from global → regional → street-level
* Camera tilt and rotation
* Perspective view (not top-down only)
* Continuous, fluid navigation (no page transitions)

### Design Principle:

> The experience should feel like *flying through the world of the book*, not browsing a static map.

---

## **1.2 Multi-Scale Event Rendering**

* Events are structured hierarchically:

  * **Zoomed out (planet view):** Major narrative arcs
  * **Mid zoom (regional):** Key scenes
  * **Zoomed in (local):** Specific moments

* Progressive disclosure ensures:

  * Minimal clutter at large scale
  * Rich, dense storytelling at close range

---

## **1.3 Spatial Anchoring**

* Every event is tied to a real-world coordinate:

  * Precise when explicitly stated
  * Approximate when inferred

* Each event includes a **confidence level**:

  * Exact
  * Approximate
  * Interpretive

---

## **1.4 Earth Representation (Time-Aware Styling)**

While the geometry is always Earth, its **visual and political representation adapts to the book**.

![Image](https://images.openai.com/static-rsc-4/5QcrdmVaU26EnD0fQobFGV6QPgxXI8FKkCsmLX7PAg_d2zFJg50e5houaXi4U2_a4su77iizeUbKjOdmxwckhf6NjZW_5b8RntQyj9QXGuAmYVMqna3QQf0wNvMtbb87MoD7Nt8z60473uNjSbJrnjKpSCEk4fASe7hKaZoOi6he4mnqKGqzZXPYYcL9R-Ud?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Q5rLrqEJG7_o_569Lp9KgjixpVlU6-_2GNIEfP8YJnPzcyj3dRvvM0p24jXF9W-zjd7OYN0eW11--V5bKut78fvstCMB2NeXVhoHeMZFE_EUZ5qd74T8aIcYLFCefL20cCH8_prxQYrX6XR7aplVclH8dqZYnwnnJiVihu1tp8Ve1TPUAkBI4AIHToo7q59f?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/aiLBluwYUVIfEcKuOIi8KAYFUPzj43zTzqDtHViA3c4XI_K0nK_t80g3lxxWK3yd0I7rnyvscUPO0Iom40xN8uE_teEejoBoSBGgnIcPYqjc7I9-W4hvneUCkoomQoVhPkqxeNmiXixI1WACAx20HR_ItmaRNmBC4ukfu_5yW6cnfJvO0LAXuLFlPSv19PQU?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/QAQCsV_JhVeVXkZsucAjJnZKY9_bes72qLWlHKEFn0qz39hwzam8sq829dE9Vbo2HB9v8wf5GVgkENWcto385dMWzO3lK3SrHybUKzn60lfqgwHUPJoukkA3jLsN6VH82sf2RQOxYwoDa8ma5P8K3tS5xVUTwlFIaeBUVQpHYB6rK106YbYC2aKp6DRedqAi?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/VaRmkQ89PQq4wyckYkSBYDDsXxVZ0LKTZLFgmiKuHydiVVNPgnAY7auwVh5X_jGWdWW0eJc5wEJPMEyNetTKGlYfnP9moAIHcmXwY7jTEjfJZnkFV5eSIOkziqFFd8Xsn25g47WGs69IETMs7Qg-maBI7UBYINLbNv89T5Zi-_uxmfe7FsJcHVXDqk9clSQQ?purpose=fullsize)


### Supported Variations:

* Modern political Earth
* Historical political Earth (period-accurate borders)
* Minimal geographic Earth (terrain-focused)

---

## **1.5 Temporal Context (Lightweight)**

* Events are ordered along the narrative timeline
* Optional timeline indicator (non-interactive initially)
* The globe itself remains visually consistent during exploration

---

# **Feature Area 2: Event Extraction & Representation**

*(unchanged from prior version, included here for completeness)*

## **2.1 Input Constraint**

* Only input: full book text

---

## **2.2 Event Definition**

Each event includes:

* Title
* Description
* Location
* Narrative position
* Importance score
* Text excerpt(s)
* **Illustration (required)**

> If an event does not justify an illustration, it is excluded.

---

## **2.3 Event Hierarchy**

* Arcs → Scenes → Moments
* Drives zoom-based aggregation

---

## **2.4 Event Selection Algorithm (Conceptual)**

Pipeline:

1. Text analysis (locations, characters, transitions)
2. Candidate event generation
3. Scoring (importance, clarity, visual potential)
4. Filtering (remove weak events)

---

## **2.5 Illustration Generation**

* Every event has a visual
* No generic markers
* Style consistency is critical

---

## **2.6 Feedback **

* Trainer should be able to provide feedback in algorithm to steer it if they feel it's lacking something.

---

# **Feature Area 3: Book-Specific Earth Map Generation**

This is not just selecting a map style — the system produces a **distinct Earth experience per book**.

## **3.1 Core Principle**

> Every book generates its own version of Earth.

Even though all maps are Earth-based, each one is:

* Visually distinct
* Contextually appropriate
* Narratively aligned

---

## **3.2 Map Types (Earth-Based)**

![Image](https://images.openai.com/static-rsc-4/pwX0QDVv33-CjvEjm6KrZwiA8LBSWwZVJ_suQR99tvbJdv2jGZXHEdtrlAlL2wSK7PySIWPK4kLhP4OTUYUM01Ju0O0W8ps8CjQ61grSufBk9WR0ExZ-ef6qo9hmaSGK6Yy9IZlg5BwSm1LxrUndAfqq8-_VZPU6DY0y187d-RmOjd__HlprN48tYS5fjF6A?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/y6CHbF4rEIjLAt60kJPfMyjnGXWwv5_AlGRx2FBpwOHYQrqnYEvYwedvzgi8G2U28xOXbgvrh2lFHXyMYPmFKYUIA4ZK227i7RogVNhx1eMEUOxO_28bAuMGh-5ARW-5axBg5Q8jF64_UUbczKfe_US5PboUj9OshB3l2OQqcT6sr3U-XCaqTjbPYBoNfl-V?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/aimiYsx1JKto-VDF088G7ooQfD3INzvBLHgGKL22Paf_uV_8By5bveIwHiQyV_8l8wfHm4ewWcT6x6GidReYDLu7n2lHgDsK5za13GczsUPxwItVqrQ1flHB7OEQgTr6AwLEhTRHrvjFkyrl4l7BEAb00s6Uk2uvNhMlKxwVJOjoY8URBD9AvNIgLVCRMQ8U?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/7lucXSxB07Gy5NyX1wiuJ_aLNFz2kUJyzI6mhpABnvkgFmIKYqMTx2BHUcUvSUN1Rva75mh2zlMoDKFQEzqdgVU8VSMIdp7V-V9YTCLQVFhz-gnOOWirUmfvPO84JGWrrORZyLhf4qNwgnU_ByfK0mmUMn5qSgC9YV95t7WBMHCNlhapq5brnr41kYiVRxp5?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/j_GtWtk99qfBm-lmiXUz8V4LRExgyvRRacJ5mUEHNqgFEeadtumEafkhAGDLTQ_KI9EdjiWBKrqbXmWYYx0UNE0eMVxalT7fkjCajo4LFm5EBvuNx-lpxdt8cRnMzktwtR_53VeytnTFZh5MJvpth26y49WdfmkBQ3nRvNKFMBweBP4sRDcFH6POMvU5dOI0?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Mri_3PRUvA-EMk5w43dMwInQSCwDofF5G6xv-kBF3eReAVP4CpjaNSdMLq5MoGD3S6AEfcXLThcLKaHKKhSMl7GBcBWog_YMVhyM-JN3mn6Vq_K7Yhoi7wABuomXU7jUUN17ZxiezihBT88Nf7mZ6HthlMvbv6ycufqvejlVw3fxkmemcNBSpCRx5xZAM93x?purpose=fullsize)

Each book selects one primary map type:

1. **Modern Earth**

   * Contemporary setting

2. **Historical Political Earth**

   * Borders reflect the story’s time period

3. **Geographic Earth**

   * Terrain-focused, minimal political detail

---

## **3.3 Book-Specific Customization**

Even within the same type, maps differ per book:

### Dimensions of Variation:

* Color palette and tone (e.g., muted vs vibrant)
* Label density (cities vs minimal labeling)
* Emphasis:

  * Political boundaries
  * Terrain
  * Urban areas

### Example:

* Two 19th-century novels may both use “historical Earth,” but:

  * One emphasizes imperial borders
  * Another emphasizes terrain and travel routes

---

## **3.4 Location Mapping Workflow**

1. Extract locations from text
2. Resolve to real-world places
3. Assign coordinates (exact/approximate)
4. Place onto the **book-specific Earth instance**

---

# **Feature Area 4: Data Model (Conceptual)**

## **Entities**

* Book
* Event
* Location
* Map Variant

## **Relationships**

* Book → Events
* Event → Location
* Event → Parent Event
* Book → Map Variant

---

# **Feature Area 5: Discovery & Exploration**

## **5.1 Book Selection**

User manually selects the base book, and can select other books to overlay on top.

---

## **5.2 Multi-Book Overlay (Controlled)**

![Image](https://images.openai.com/static-rsc-4/r8vMygnviEf5sApFjHVwot77kqIf1Ty8lxWrVqjk7pMBZmfcfFTb-lWHGWd5NyhSRQnBQTufPuh2vHBGagtH43E182GSeyn7p6hyEHOxzo72D3TNudd0hY2SrDW7eTVxvRuLH4kZQKhebU2Tx4bxGM345Ghdp0ptSJ7Mar7ndh01JZzRA96vlOqxC33i2OQV?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/q3FG2hEZE-XGmGh9mzLoBGGKYXHXy-Ljf9ZBos6aMvwYpnsBapN_Gly7B1OWP_V9bZf7THNvVT8SoVf9a9Dkx2AaSK9J-9eoZwK2TOd7sz_S50Fr4Drt1nLvjsnMIqvMobPomOYC5SWkjHYQMmiLg3i77V03vfhMJQWZLGvUdYETkAUA0nMN6ZNvcITJOuiJ?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/gRqmb1v70W1jrcw8_98j_Y55Roh9RbSITd2I4OM6iU9GIAF2DfxYSxiZ_hy5RSeduHRX-f8ToBo9mG91fobeRunlIaJ16ovtQSd6TqEfKb5LfaTWnD92V_yCVI8f3QNqG_bY7EnEN-qBZ6OegtDQ5IPBsOLTYohKHeCSqD1jYMgmMv9D1ENOBzXyBqGbyGQh?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/uyjcRc6OG19-XKcPkKPozoD1FAV9r1Q-3kOOJPNBCAM-tEBn9J52-SOrlQIWFbaNgIrRjveDp3PMqWDO-NDo5xZZPcChbEa7fC4cexcKMrUbReo_1xuzSmJnrQWL9AYWrs67qtYYLTrr6RWimrHbhjhTa2IE3Gq2q_I6s3GSsoDz4_g8x_tancMhm_vbWtOS?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/QGYtRJEzKUYDwOArOCRq_yI1DGZlpPpnSXbzQV1p37l2zrwZ4z5svGzfZLo5iDjQfkLFmup1Xtw7QNGHP8MN9wPuLtbAJ6PKgWRkSJU0uMij_Zbt8LukqmZWI4acVGQLYpV3E8N0eeT2rc_h4fq_sHEsVHLtUJR-CDgDsBN8Sa4Gsy0leoJhxU66sYKgueQn?purpose=fullsize)

* Multiple books can be overlaid

### Constraint:

* **One primary book defines the Earth instance**

  * Its map determines:

    * Visual style
    * Time period
    * geographic framing

* Other books’ events are layered on top

---

## **5.3 Filtering**

* Filter by:

  * Character
  * Narrative arc
  * Importance

