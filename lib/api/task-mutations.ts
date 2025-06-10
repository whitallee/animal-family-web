import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
import { Task } from "@/types/db-types";

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
    const { token } = useAuth();
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (task: Task) => markTaskComplete(token!, task),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", { token }] });
        }
    });
};