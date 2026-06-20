import type { Task } from '@todo/shared';
import { useRef, useState } from 'react';
import { useDeleteTask, useEditTask, useToggleTask } from '../hooks/useTasks.js';

interface TaskItemProps {
  task: Task;
}

/** Single task row: checkbox, editable title, delete button. */
export function TaskItem({ task }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: toggle } = useToggleTask();
  const { mutate: editTask } = useEditTask();
  const { mutate: deleteTask } = useDeleteTask();

  const startEdit = () => {
    setDraft(task.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > 500) {
      cancelEdit();
      return;
    }
    if (trimmed !== task.title) {
      editTask({ id: task.id, title: trimmed });
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(task.title);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <li className="flex items-center gap-3 px-4 py-3 group border-b border-gray-100 last:border-0">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => toggle({ id: task.id, completed: e.target.checked })}
        className="w-5 h-5 rounded-md border-gray-300 text-indigo-500 focus:ring-indigo-400 cursor-pointer accent-indigo-500 flex-shrink-0"
        aria-label={task.completed ? 'Mark as active' : 'Mark as completed'}
      />

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          maxLength={500}
          className="flex-1 px-2 py-1 rounded-lg border border-indigo-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          aria-label="Edit task title"
        />
      ) : (
        <button
          type="button"
          onClick={startEdit}
          className={`flex-1 text-sm text-left cursor-text select-none bg-transparent border-0 p-0 ${
            task.completed ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
          aria-label={`Edit task: ${task.title}`}
        >
          {task.title}
        </button>
      )}

      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-gray-400 hover:text-red-500 transition rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 flex-shrink-0"
        aria-label={`Delete task: ${task.title}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </li>
  );
}
