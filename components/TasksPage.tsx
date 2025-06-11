"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { useMarkTaskComplete } from '@/lib/api/task-mutations';
import { Task } from '@/types/db-types';
import { unstable_ViewTransition as ViewTransition } from 'react'
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
// import { useHabitats, useSpecies } from '@/lib/api/fetch-species-habitats';
import { useTasks } from '@/lib/api/fetch-family';

function TaskItem({ task }: { task: Task }) {    
    const markComplete = useMarkTaskComplete();

    return (
            <div className="w-full flex items-center gap-2">
                <Button 
                    className="w-6 h-6 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        markComplete.mutate(task);
                    }}
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
        <div className="flex items-center gap-4 w-full">
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
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
        </>
    )
}

function TaskList({ tasks }: { tasks: Task[] | undefined }) {
    if (tasks && tasks.length === 0) {
        return <div>No tasks found... Maybe you&apos;re forgetting something?</div>
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            {tasks && [...tasks]
                .sort((a, b) => Number(a.complete) - Number(b.complete))
                .map((task) => (
            <AccordionItem value={task.taskId.toString()} key={task.taskId}>
                <div className="flex items-center">
                    <TaskItem task={task} />
                    <AccordionTrigger className="flex-1" />
                </div>
                <AccordionContent>
                    <p>{task.taskDesc}</p>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
    )
}
//p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300
export default function TasksPage() {
    // const { data: animals, isPending: animalsPending } = useAnimals();
    // const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
    const { data: tasks, isPending: tasksPending } = useTasks();
    // const { data: species, isPending: speciesPending } = useSpecies();
    // const { data: habitats, isPending: habitatsPending } = useHabitats();
    
    return (
        <ViewTransition name="tasks">
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <h1 className="text-2xl font-medium">Tasks</h1>
                {tasksPending ? <TaskListSkeleton /> : <TaskList tasks={tasks} />}
            </div>
        </ViewTransition>
    );
}