# Metadata
Status: TODO

Epic: MVP

# User Statement

As a user of Book Earth, I want a rich set of events populated on the map for a given book, so that I view many points of interest.

# Notes
- I do not have a clear vision of how this implementation will work. The input will be a txt file containing the text from the book. The output needs to be a list of events.
- The events should have some notion of importance - we want to show the right amount of events on the map to not feel too crowded or sparse, irrespective of zoom (with the exception of if there's literally nothing that takes place in the book there).
- Do not feel constrained by the Event struct defined in event.go - we have freedom to change the data structure if our design here calls for it.

# Acceptance Criteria
- Align with human on a workflow for extracting events from a book. After aligning, document plan in this ticket's directory.
- Implement plan, using a txt file for Around the World in Eighty Days that the human will provide
