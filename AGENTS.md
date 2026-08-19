# Repository instructions

These rules apply to all work in this repository.

## Start of chat

- After reading this file, display `### AGENTS.md LOADED — REPOSITORY INSTRUCTIONS ACTIVE ###` exactly once per chat.

## Planning

- Before starting a new task, inspect the relevant code and present a simple implementation plan.
- Ask questions only when the answers could materially change the implementation and cannot be found in the repository.
- Wait for explicit user approval before editing files or running project-mutating commands. Read-only investigation is allowed before approval.
- If the scope changes materially, update the plan and request approval again.

## Angular

- Always follow the official Angular documentation at `https://angular.dev/`, using guidance appropriate for the repository's Angular version.
- Prefer built-in Angular and browser features.
- Do not add or install third-party packages. If one would provide a significant benefit, explain why and ask the user to install it manually.
- If the user requests an Angular anti-pattern or something contrary to official best practices, stop and clearly report the issue before proceeding.

## Implementation

- Prefer the simplest viable solution. Avoid unnecessary abstractions, indirection, and optimization.
- Do not design for hypothetical future features.
- Keep changes limited to the approved task and preserve unrelated user work.
- For UI work, account for relevant accessibility, keyboard, and responsive behavior.
- Do not change persisted-data formats without an approved migration that preserves existing data.

## Git

- Git use is read-only. Never change Git state, history, staging, branches, tags, or remotes, and never commit changes.

## Completion

- Run relevant existing checks in proportion to the change. Report what passed and what could not be run.
- At the end of every completed implementation task, suggest one semantic commit message covering the whole task and all refinements. Provide the message only; never commit it.
