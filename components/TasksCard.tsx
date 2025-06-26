
// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShortTaskListSkeleton } from "@/components/Skeletons";

// Icons
import { Check, ChevronRight, Loader2, TriangleAlert } from "lucide-react";

// API Hooks
import { useMarkTaskComplete, useMarkTaskIncomplete } from "@/lib/api/task-mutations";

// Types
import type { Task } from "@/types/db-types";

// Utilities
import { hoursSinceDue } from "@/lib/helpers";
import Link from "next/link";

function TaskItem({ task }: { task: Task }) {
    const markComplete = useMarkTaskComplete();
    const markIncomplete = useMarkTaskIncomplete();
    return (
            <div className="flex items-center gap-2">
                <Button 
                    className="w-6 h-6 p-0"
                    onClick={() => task.complete ? markIncomplete.mutate(task) : markComplete.mutate(task)}
                    disabled={markComplete.isPending || markIncomplete.isPending}
                >
                     {markComplete.isPending ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                     ) : task.complete ? (
                         <Check />
                     ) : null}
                </Button>
                <h3>{task.taskName}</h3>
                <div className="flex-1"></div>
                {hoursSinceDue(task) > 24 ? <TriangleAlert className="w-5 h-5 text-red-400 mr-4" /> : null}
            </div>
    )
}

function TaskList({ tasks }: { tasks: Task[] | undefined }) {
    if (tasks && tasks.length === 0) {
        return <div className="text-center text-stone-400">No tasks assigned!</div>
    }
    if (tasks && tasks.every(task => task.complete)) {
        return <div className="text-center text-stone-400">All tasks are complete!</div>
    }
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
                    
                    return 0;
                }).map((task) => (
                task.complete ? (
                    null
                ) : (
                    <TaskItem key={task.taskId} task={task} />
                )
            ))}
        </>
    )
}

export default function TasksCard({ tasks, isPending, className, home }: { tasks: Task[] | undefined, isPending: boolean, className?: string, home?: boolean }) {
    return (
        <div className="w-full flex flex-col items-center">
            <Card className={`w-full max-w-md max-h-[30vh] overflow-y-scroll p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300 ${className}`}>
                {/* {home ? <Link href="/tasks" className="absolute top-[2.125rem] right-8 w-6 h-6 p-0"><ChevronRight className="w-6 h-6" /></Link> : null} */}
                {isPending ? <ShortTaskListSkeleton /> : <TaskList tasks={tasks} />}
            </Card>
            {/* {home ? <Link className="bg-stone-800 p-1.5 rounded-b-lg" href={"/tasks"}>View Tasks</Link> : null } */}
        </div>
    )
}