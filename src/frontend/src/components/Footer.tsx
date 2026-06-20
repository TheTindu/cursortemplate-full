import type { Task } from '@todo/shared';
import { useClearCompleted } from '../hooks/useTasks.js';
import type { Filter } from './App.js';

interface FooterProps {
  tasks: Task[];
  filter: Filter;
  onFilterChange: (f: Filter) => void;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

/** Displays remaining count, filter tabs, and clear-completed button. */
export function Footer({ tasks, filter, onFilterChange }: FooterProps) {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const hasCompleted = tasks.some((t) => t.completed);
  const { mutate: clearCompleted, isPending } = useClearCompleted();

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 border-t border-gray-100">
      <span className="min-w-[5rem]">
        <strong className="font-semibold text-gray-700">{activeCount}</strong>
        {activeCount === 1 ? ' item left' : ' items left'}
      </span>

      <nav className="flex gap-1" aria-label="Task filter">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
              filter === value ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-500'
            }`}
            aria-current={filter === value ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="min-w-[5rem] flex justify-end">
        {hasCompleted && (
          <button
            type="button"
            onClick={() => clearCompleted()}
            disabled={isPending}
            className="text-xs text-gray-400 hover:text-red-500 transition focus:outline-none focus:ring-2 focus:ring-red-300 rounded disabled:opacity-40"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
