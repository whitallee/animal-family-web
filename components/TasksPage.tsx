"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useMarkTaskComplete } from '@/lib/api/task-mutations';
import { Animal, Enclosure, Task } from '@/types/db-types';
import { unstable_ViewTransition as ViewTransition } from 'react'
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useAnimals, useEnclosures, useTasks } from '@/lib/api/fetch-family';

const progress = (task: Task) => {
    if (!task.complete) {
        return 100;
    } else {
        return ((new Date().getTime() - new Date(task.lastCompleted).getTime()) / 1000 / 60 / 60)/task.repeatIntervHours*100;
    }
}

// const timeSinceLastCompleted = (task: Task) => {
//     return Math.abs(new Date(task.lastCompleted).getTime() - new Date().getTime());
// }

// const timeSinceDue = (task: Task) => {
//     return Math.abs((new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000) - new Date().getTime());
// }

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
                <div className="flex-1"></div>
                <CircularProgressbarWithChildren className="w-6 h-6 mr-2" value={progress(task)}>
                    {/* <p>{ReadableTime(timeSinceDue(task))}</p> */}
                    {/* <p>{progress(task)}%</p> */}
                </CircularProgressbarWithChildren>
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

function ReadableTime(interval: number) {
    if (interval > 8760) {
        return `${(interval / 8760).toFixed(1)} years`;
    } else if (interval === 8760) {
        return `1 year`;
    } else if (interval > 720) {
        return `${(interval / 720).toFixed(1)} months`;
    } else if (interval === 720) {
        return `1 month`;
    } else if (interval > 168) {
        return `${(interval / 168).toFixed(1)} weeks`;
    } else if (interval === 168) {
        return `1 week`;
    } else if (interval > 24) {
        return `${(interval / 24).toFixed(1)} days`;
    } else if (interval === 24) {
        return `1 day`;
    } else if (interval > 1) {
        return `${interval.toFixed(1)} hours`;
    } else if (interval === 1) {
        return `1 hour`;
    } else {
        return `${(interval * 60).toFixed(1)} minutes`;
    }
}

function TaskList({ tasks, animals, enclosures }: { tasks: Task[] | undefined, animals: Animal[] | undefined, enclosures: Enclosure[] | undefined }) {
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
                    <p><span className="font-bold text-stone-400">Subject:</span> {task.animalId ? animals?.find(animal => animal.animalId === task.animalId)?.animalName : enclosures?.find(enclosure => enclosure.enclosureId === task.enclosureId)?.enclosureName}</p>
                    <p><span className="font-bold text-stone-400">Description:</span> {task.taskDesc}</p>
                    <p><span className="font-bold text-stone-400">Last Completed:</span> {new Date(task.lastCompleted).toLocaleDateString()} {new Date(task.lastCompleted).toLocaleTimeString()}</p>
                    <p><span className="font-bold text-stone-400">Next Due:</span> {new Date(new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000).toLocaleDateString()} {new Date(new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000).toLocaleTimeString()}</p>
                    <p><span className="font-bold text-stone-400">Repeat Interval:</span> {ReadableTime(task.repeatIntervHours)}</p>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
    )
}
//p-4 flex flex-col gap-3 bg-stone-700 text-stone-50 shadow-lg border-stone-600 transition-all duration-300
export default function TasksPage() {
    const { data: animals, isPending: animalsPending } = useAnimals();
    const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
    const { data: tasks, isPending: tasksPending } = useTasks();
    
    return (
        <ViewTransition name="tasks">
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <h1 className="text-2xl font-medium">Tasks</h1>
                {animalsPending || enclosuresPending || tasksPending ? <TaskListSkeleton /> : <TaskList tasks={tasks} animals={animals} enclosures={enclosures} />}
            </div>
        </ViewTransition>
    );
}