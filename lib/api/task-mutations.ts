import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
import { Task } from "@/types/db-types";
import { getQueryClient } from "@/lib/get-query-client";

export const markTaskComplete = async (token: string, task: Task) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "taskId": task.taskId,
            "taskName": task.taskName,
            "taskDesc": task.taskDesc,
            "complete": true,
            "lastCompleted": new Date().toISOString(),
            "repeatIntervHours": task.repeatIntervHours
        })
    });
    return res.json();
};

export const useMarkTaskComplete = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (task: Task) => markTaskComplete(token!, task),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};

export const markTaskIncomplete = async (token: string, task: Task) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "taskId": task.taskId,
            "taskName": task.taskName,
            "taskDesc": task.taskDesc,
            "complete": false,
            "lastCompleted": task.lastCompleted,
            "repeatIntervHours": task.repeatIntervHours
        })
    });
    return res.json();
};

export const useMarkTaskIncomplete = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (task: Task) => markTaskIncomplete(token!, task),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};

export const createTask = async (token: string, task: Task) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task`, {
        method: "POST",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "taskName": task.taskName,
            "taskDesc": task.taskDesc,
            "repeatIntervHours": task.repeatIntervHours,
            "animalId": task.animalId,
            "enclosureId": task.enclosureId
        })
    });
    return res.json();
};

export const useCreateTask = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (task: Task) => createTask(token!, task),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};

interface UpdateTaskPayload {
    taskId: number;
    taskName: string;
    taskDesc: string;
    complete: boolean;
    lastCompleted: string;
    repeatIntervHours: number;
}

export const updateTask = async (token: string, payload: UpdateTaskPayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update task');
    }
    
    // Returns 204 No Content on success
    return;
};

export const useUpdateTask = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (payload: UpdateTaskPayload) => updateTask(token!, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};