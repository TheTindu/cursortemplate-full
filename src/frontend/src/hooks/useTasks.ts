import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task } from '@todo/shared';
import { clearCompleted, createTask, deleteTask, fetchTasks, updateTask } from '../api.js';

const TASKS_KEY = ['tasks'] as const;

/**
 * Fetches all tasks from the API.
 * Data is ordered by id ASC (as returned by the server).
 */
export function useTasksQuery() {
  return useQuery({ queryKey: TASKS_KEY, queryFn: fetchTasks });
}

/** Optimistically adds a new task at the end of the list. */
export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (title: string) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY) ?? [];

      const optimistic: Task = {
        id: Date.now() * -1,
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData<Task[]>(TASKS_KEY, [...previous, optimistic]);
      return { previous };
    },
    onError: (_err, _title, ctx) => {
      if (ctx) qc.setQueryData<Task[]>(TASKS_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

/** Optimistically toggles a task's completed state. */
export function useToggleTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTask(id, { completed }),
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY) ?? [];
      qc.setQueryData<Task[]>(
        TASKS_KEY,
        previous.map((t) => (t.id === id ? { ...t, completed } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData<Task[]>(TASKS_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

/** Optimistically updates a task's title. */
export function useEditTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) => updateTask(id, { title }),
    onMutate: async ({ id, title }) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY) ?? [];
      qc.setQueryData<Task[]>(
        TASKS_KEY,
        previous.map((t) => (t.id === id ? { ...t, title: title.trim() } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData<Task[]>(TASKS_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

/** Optimistically removes a single task. */
export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY) ?? [];
      qc.setQueryData<Task[]>(
        TASKS_KEY,
        previous.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx) qc.setQueryData<Task[]>(TASKS_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

/** Optimistically removes all completed tasks. */
export function useClearCompleted() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: clearCompleted,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: TASKS_KEY });
      const previous = qc.getQueryData<Task[]>(TASKS_KEY) ?? [];
      qc.setQueryData<Task[]>(
        TASKS_KEY,
        previous.filter((t) => !t.completed),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData<Task[]>(TASKS_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}
