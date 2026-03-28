# Metadata
Status: TODO

Epic: MVP

# User Statement

As a developer of Book Earth, I want e2e tests for the frontend so that I can verify the globe loads correctly, event markers appear, and clicking a marker selects an event.

# Notes
- Playwright is an option for e2e tests, but we can consider others
- The Cesium globe requires a real browser with WebGL — this is why e2e rather than unit tests
- Key flows to cover:
  - Page loads and globe renders
  - Event markers appear on the globe
  - Clicking a marker updates the selected event in the sidebar
- The backend must be running for e2e tests (or use a mock server)

# Acceptance Criteria
- Align with human on e2e test framework
- Tests cover the flows described above
- Tests are integrated into run-test-suite.sh
