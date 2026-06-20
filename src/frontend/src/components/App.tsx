import { useState } from 'react';
import { useTasksQuery } from '../hooks/useTasks.js';
import { AddTaskInput } from './AddTaskInput.js';
import { Footer } from './Footer.js';
import { TaskList } from './TaskList.js';

/** Valid filter values for the task list. */
export type Filter = 'all' | 'active' | 'completed';

/** Root component — manages filter state and composes the UI. */
export function App() {
  const [filter, setFilter] = useState<Filter>('all');
  const { data: tasks, isLoading, isError, error } = useTasksQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-indigo-600 tracking-tight mb-8 text-center">
          todos
        </h1>

        <AddTaskInput />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading && <p className="py-10 text-center text-sm text-gray-400">Loading…</p>}

          {isError && (
            <p className="py-10 text-center text-sm text-red-400">
              {error instanceof Error ? error.message : 'Something went wrong.'}
            </p>
          )}

          {tasks && (
            <>
              <TaskList tasks={tasks} filter={filter} />
              {tasks.length > 0 && (
                <Footer tasks={tasks} filter={filter} onFilterChange={setFilter} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
