import { Check, ChevronRight, Loader2, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/db-types";
import { useMarkTaskComplete } from "@/lib/api/task-mutations";
import Link from "next/link";
import { hoursSinceDue } from "@/components/TasksPage";
import { ShortTaskListSkeleton } from "@/components/Skeletons";

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
                <div className="flex-1"></div>
                {hoursSinceDue(task) > 24 ? <TriangleAlert className="w-5 h-5 text-red-400 mr-4" /> : null}
            </div>
    )
}

function TaskList({ tasks }: { tasks: Task[] | undefined }) {
    if (tasks && tasks.length === 0) {
        return <div>No tasks found... Maybe you&apos;re forgetting something?</div>
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

export default function TasksCard({ tasks, isPending }: { tasks: Task[] | undefined, isPending: boolean }) {
    return (
            <Card className="w-full max-w-md max-h-[30vh] overflow-y-scroll p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300">
                <Link href="/tasks" className="absolute top-6 right-6 w-6 h-6 p-0"><ChevronRight className="w-6 h-6" /></Link>
                {isPending ? <ShortTaskListSkeleton /> : <TaskList tasks={tasks} />}
            </Card>
    )
}