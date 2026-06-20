import type { Task } from '@todo/shared';
import type { Filter } from './App.js';
import { TaskItem } from './TaskItem.js';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
}

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: 'No tasks yet — add one above.',
  active: 'Nothing left to do. Enjoy the quiet.',
  completed: 'Nothing completed yet. Get to it.',
};

/** Renders the filtered task list or a contextual empty-state message. */
export function TaskList({ tasks, filter }: TaskListProps) {
  const visible = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (visible.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-gray-400 italic">{EMPTY_MESSAGES[filter]}</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {visible.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
