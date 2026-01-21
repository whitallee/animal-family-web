
// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShortTaskListSkeleton } from "@/components/Skeletons";

// Icons
import { Check, Loader2, TriangleAlert } from "lucide-react";

// API Hooks
import { useMarkTaskComplete, useMarkTaskIncomplete } from "@/lib/api/task-mutations";

// Types
import type { Task } from "@/types/db-types";

// Utilities
import { hoursSinceDue, hoursUntilDue } from "@/lib/helpers";

function TaskItem({ task, onTaskClick }: { task: Task, onTaskClick?: (taskId: number) => void }) {
    const markComplete = useMarkTaskComplete();
    const markIncomplete = useMarkTaskIncomplete();
    return (
            <div className="flex items-center gap-2">
                <Button 
                    className="w-6 h-6 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (task.complete) {
                            markIncomplete.mutate(task);
                        } else {
                            markComplete.mutate(task);
                        }
                    }}
                    disabled={markComplete.isPending || markIncomplete.isPending}
                >
                     {markComplete.isPending ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                     ) : task.complete ? (
                         <Check />
                     ) : null}
                </Button>
                <h3
                    className={`${onTaskClick ? "cursor-pointer hover:underline" : ""} ${task.complete ? "line-through text-stone-400" : ""}`}
                    onClick={() => onTaskClick?.(task.taskId)}
                >
                    {task.taskName}
                </h3>
                <div className="flex-1"></div>
                {hoursSinceDue(task) > 24 ? <TriangleAlert className="w-5 h-5 text-red-400 mr-4" /> : null}
            </div>
    )
}

function TaskList({ tasks, onTaskClick }: { tasks: Task[] | undefined, onTaskClick?: (taskId: number) => void }) {
    if (tasks && tasks.length === 0) {
        return <div className="text-center text-stone-400">No tasks assigned!</div>
    }
    // if (tasks && tasks.every(task => task.complete)) {
    //     return <div className="text-center text-stone-400">All tasks are complete!</div>
    // }
    return (
        <>
            {tasks && [...tasks]
                .sort((a, b) => {
                    // First sort by completion status (incomplete first)
                    if (a.complete !== b.complete) {
                        return Number(a.complete) - Number(b.complete);
                    }

                    // For incomplete tasks, sort by highest hoursSinceDue first
                    if (!a.complete && !b.complete) {
                        return hoursSinceDue(b) - hoursSinceDue(a);
                    }

                    // For complete tasks, sort by lowest hoursUntilDue first
                    if (a.complete && b.complete) {
                        return hoursUntilDue(a) - hoursUntilDue(b);
                    }

                    return 0;
                }).map((task) => (
                    <TaskItem key={task.taskId} task={task} onTaskClick={onTaskClick} />
            ))}
        </>
    )
}

export default function TasksCard({ tasks, isPending, className, onTaskClick }: { tasks: Task[] | undefined, isPending: boolean, className?: string, onTaskClick?: (taskId: number) => void }) {
    return (
        <div className="w-full flex flex-col items-center">
            <Card className={`w-full max-w-md max-h-[30vh] overflow-y-scroll p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300 ${className}`}>
                {isPending ? <ShortTaskListSkeleton /> : <TaskList tasks={tasks} onTaskClick={onTaskClick} />}
            </Card>
        </div>
    )
}