---
name: code-quality
description: Quick code quality check plus small refactor for non-trivial code changes. Use whenever making significant edits (1+ files with real logic changes), even if the user doesn’t explicitly ask, to validate correctness and simplify control flow.
---

# Code Quality

## Overview
Do a fast, low-risk review of the provided code and apply a small refactor that improves clarity without changing behavior.

## Workflow
1. Read the target code and restate the intended behavior in one sentence.
2. Check for easy wins: duplicate branches, unreachable code, unnecessary conditions, unclear early returns, or inconsistent config fallbacks.
3. Apply a minimal refactor that reduces branching and keeps behavior identical; explain the change briefly.

## Heuristics (keep it small)
- Prefer early returns over nested blocks.
- Eliminate duplicate condition checks.
