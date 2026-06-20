import { useState } from 'react';
import { useCreateTask } from '../hooks/useTasks.js';

/** Controlled text input that creates a new task on submit. */
export function AddTaskInput() {
  const [value, setValue] = useState('');
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > 500) return;
    createTask(trimmed, {
      onSuccess: () => setValue(''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        maxLength={500}
        disabled={isPending}
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition disabled:opacity-50"
        aria-label="New task title"
      />
      <button
        type="submit"
        disabled={isPending || !value.trim()}
        className="px-5 py-3 rounded-xl bg-indigo-500 text-white font-medium shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
}
