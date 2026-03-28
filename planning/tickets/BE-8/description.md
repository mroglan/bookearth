# Metadata
Status: DONE

Epic: MVP

# User Statement

As a maintainer of Book Earth, I want to refactor the frontend so that there is clearer separation between the logic for requesting new events, and the logic for displaying event data on the globe, so that it is easier to develop each aspect in parallel.

# Notes
- an initial `frontend` exists which pulls data from the api and displays events on a cesium globe
- we do not want to change the api in this story, just improve the UI's structure. for example:
    - I don't want a bunch of complex state logic in the page.tsx - that should be a simple wrapper over components
- also, simplify any code you see is overly complex. the goal is to simply:
    - pull map composition from {api}/books/1/map-composition
    - pull events from {api}/books/1/events
    - display cesium globe with given map composition applied
    - display events on map that user can click on (which the current code does)

# Acceptance Criteria
- Present plan to human, written to md file in this directory
- Plan is executed