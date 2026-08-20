import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  updateTask as updateTaskRequest,
} from "@/lib/api/generated/tasks/tasks";
import type { Task } from "@/types/db-types";
import { queryKeys } from "./keys";

/**
 * Task mutations over the generated v2 client.
 *
 * A task belongs to exactly one subject, an animal or an enclosure, and v2
 * requires that subject on every update rather than only when it changes. So
 * every input here carries it. Callers already hold it: the task list returns
 * animalId and enclosureId on each task, and so does GET /tasks/{id}.
 */

/** Identifies the animal or enclosure a task belongs to. Exactly one is set. */
export interface TaskSubject {
  animalId?: number | null;
  enclosureId?: number | null;
}

export interface CreateTaskInput extends TaskSubject {
  taskName: string;
  taskDesc: string;
  repeatIntervHours: number;
}

export interface UpdateTaskInput extends TaskSubject {
  taskId: number;
  taskName: string;
  taskDesc: string;
  complete: boolean;
  lastCompleted: string;
  repeatIntervHours: number;
}

/**
 * v1 used 0 for "not this kind of subject"; v2 uses null, which is what the
 * nullable foreign keys behind it actually hold.
 */
function subjectOf(task: TaskSubject): TaskSubject {
  return {
    animalId: task.animalId ? task.animalId : null,
    enclosureId: task.enclosureId ? task.enclosureId : null,
  };
}

export const useCreateTask = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (task: CreateTaskInput) =>
      createTaskRequest({
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        repeatIntervHours: task.repeatIntervHours,
        ...subjectOf(task),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};

export const useUpdateTask = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ taskId, ...task }: UpdateTaskInput) =>
      updateTaskRequest(taskId, {
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        complete: task.complete,
        lastCompleted: task.lastCompleted,
        repeatIntervHours: task.repeatIntervHours,
        ...subjectOf(task),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};

export const useDeleteTask = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => deleteTaskRequest(taskId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};

/**
 * Marking complete and incomplete are the same update with a different flag;
 * v1 had them as separate functions hitting the same endpoint.
 */
function useSetTaskCompletion(complete: boolean) {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (task: Task) =>
      updateTaskRequest(task.taskId, {
        taskName: task.taskName,
        taskDesc: task.taskDesc,
        complete,
        // Completing stamps the moment; un-completing keeps whatever was there
        // so the task's original due cycle is preserved.
        lastCompleted: complete ? new Date().toISOString() : task.lastCompleted,
        repeatIntervHours: task.repeatIntervHours,
        ...subjectOf(task),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
}

export const useMarkTaskComplete = () => useSetTaskCompletion(true);

export const useMarkTaskIncomplete = () => useSetTaskCompletion(false);
