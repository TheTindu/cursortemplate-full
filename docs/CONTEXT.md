# Todo App

The ubiquitous language for a single-user todo application. One person, one list, running locally. There is no concept of users or accounts in the domain — the single user is implicit.

## Language

**Task**:
A single thing the user intends to do. The only domain entity; the list is just an ordered collection of Tasks.
_Avoid_: todo, item, entry, thing

**Title**:
The human-readable text of a Task. Trimmed, non-empty, at most 500 characters. Two Tasks may share the same Title.
_Avoid_: text, name, description, label

**Active**:
A Task that has not been ticked off (`completed` is false). The work that is still outstanding.
_Avoid_: open, pending, incomplete, unfinished

**Completed**:
A Task the user has ticked off (`completed` is true). Stays in the list, shown faded/struck-through. Reversible — a Completed Task can become Active again.
_Avoid_: done, finished, closed, archived

**Remaining count**:
The number of Active Tasks. The "how much is on my plate" indicator.
_Avoid_: pending count, todo count, outstanding count

**Filter**:
The view selector over the list, one of **All**, **Active**, or **Completed**. Changes which Tasks are shown; never changes the Tasks themselves.
_Avoid_: tab, view, mode
