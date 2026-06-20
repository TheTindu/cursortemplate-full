# Product Specification — Todo App

> **Status**: Drafted from the original idea + grilling session (2026-06-20).
> Canonical source for what the product does and why. See `docs/CONTEXT.md` for domain terms
> and `docs/architecture.md` for how it's built.

---

## 1. Problem Statement

A single person wants a quick, no-friction way to keep track of things they need to do, on their own laptop. They don't want accounts, logins, or setup — they open the app and their list is there. Existing tools feel heavy or cluttered for this simple need.

---

## 2. Target Users

| User type | Description | Primary goal |
|-----------|-------------|--------------|
| The owner (only user) | One person using the app locally on their laptop. No notion of other users. | Capture and track personal tasks with zero friction. |

---

## 3. Product Goals

- [ ] Add a task and get on with the day — adding feels instant.
- [ ] See at a glance what's left to do (and how much).
- [ ] Clean, obvious UI that needs no manual.

---

## 4. Non-Goals

- Accounts, logins, or multi-user support.
- Syncing across devices or using it on a phone.
- Due dates, reminders, categories/tags, or sharing.

---

## 5. Core User Flows

### Flow 1: Add a task
1. User types into the input box at the top of the list.
2. User submits; the new Task appears instantly at the bottom of the list as Active.

### Flow 2: Complete / reopen a task
1. User ticks a Task's checkbox.
2. It shows as Completed (faded / struck-through) and stays in place.
3. Un-ticking returns it to Active.

### Flow 3: Edit a task
1. User clicks a Task's title and edits the text.
2. On save, the title updates (same validation as creating).

### Flow 4: Delete a task
1. User removes a Task.
2. It disappears from the list permanently (hard delete).

### Flow 5: Focus the list
1. User selects a Filter: **All**, **Active**, or **Completed**.
2. The list shows only matching Tasks; if there are none, an empty state is shown (see FR-013).
3. A Remaining count shows how many Active Tasks are left.

### Flow 6: Clear all completed tasks
1. User clicks "Clear completed" (visible only when at least one Completed Task exists).
2. All Completed Tasks are hard-deleted in one action.

---

## 6. Key Functional Requirements

> See `docs/CONTEXT.md` for term definitions.

| # | Requirement | Priority |
|---|-------------|----------|
| FR-001 | The app must list all Tasks in creation order, oldest first. | Must |
| FR-002 | The user must be able to create a Task from a title. | Must |
| FR-003 | A Task title must be trimmed, non-empty, and at most 500 characters; duplicate titles are allowed. | Must |
| FR-004 | The user must be able to toggle a Task between Active and Completed (reversible). | Must |
| FR-005 | Completing a Task must not reorder it; Completed Tasks remain visible, visually de-emphasised. | Must |
| FR-006 | The user must be able to edit a Task's title (same validation as FR-003). | Must |
| FR-007 | The user must be able to delete a Task permanently. | Must |
| FR-008 | The user must be able to filter the list by All / Active / Completed. | Must |
| FR-009 | The app must display the Remaining count (number of Active Tasks). | Must |
| FR-010 | Task data must persist across app restarts (SQLite). | Must |
| FR-011 | Create/toggle/delete/clear-completed should apply optimistically so the UI feels instant. | Should |
| FR-012 | A "Clear completed" button must appear when at least one Completed Task exists and hard-delete all of them in one action. | Must |
| FR-013 | An empty filtered view must show a contextual empty state: **All** → "No tasks yet — add one above."; **Active** → "Nothing left to do. Enjoy the quiet."; **Completed** → "Nothing completed yet. Get to it." | Must |

---

## 7. Non-Functional Requirements

| Concern | Requirement |
|---------|-------------|
| Performance | Interactions feel instant (optimistic UI); local SQLite, single user. |
| Availability | Local app; no uptime target. |
| Security | All API input validated with Zod at the boundary. No auth (single-user, local). |
| Accessibility | Keyboard-operable (add, toggle, edit, delete); sensible labels. |
| Scalability | Out of scope — single user, one local list. |

---

## 8. Out-of-Scope / Later

- Due dates and reminders.
- Categories or tags.
- Sharing lists with other people.
- Mobile / phone use.

---

## 9. Open Questions

_No open questions._

---

## 10. Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-06-20 | Structured spec from idea + grilling session | |
| 2026-06-20 | Added FR-012 (clear completed), FR-013 (empty states) | |
