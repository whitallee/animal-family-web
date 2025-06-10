import { unstable_ViewTransition as ViewTransition } from 'react'
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/db-types";
import { useMarkTaskComplete } from "@/lib/api/task-mutations";

function TaskItem({ task }: { task: Task }) {
    const markComplete = useMarkTaskComplete();

    return (
            <div className="flex items-center gap-2">
                <Button 
                    className="w-6 h-6 p-0"
                    onClick={() => markComplete.mutate(task)}
                    disabled={markComplete.isPending}
                >
                     {markComplete.isPending ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                     ) : task.complete ? (
                         <Check />
                     ) : null}
                </Button>
                <h3>{task.taskName}</h3>
                {/* <p>{task.taskDesc}</p> */}
            </div>
    )
}

function TaskItemSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 aspect-square bg-stone-900 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-stone-900 rounded-full animate-pulse" />
        </div>
    )
}

function TaskListSkeleton() {
    return (
        <>
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
        </>
    )
}

function TaskList({ tasks }: { tasks: Task[] | undefined }) {
    if (tasks && tasks.length === 0) {
        return <div>No tasks found... Maybe you're forgetting something?</div>
    }
    return (
        <>
            {tasks && tasks.map((task) => (
                <TaskItem key={task.taskId} task={task} />
            ))}
        </>
    )
}

export default function TasksCard({ tasks, isPending }: { tasks: Task[] | undefined, isPending: boolean }) {
    return (
            <Card className="w-full max-w-md max-h-[30vh] overflow-y-scroll p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300">
                {isPending ? <TaskListSkeleton /> : <TaskList tasks={tasks} />}
            </Card>
    )
}