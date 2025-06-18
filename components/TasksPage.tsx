"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useMarkTaskComplete } from '@/lib/api/task-mutations';
import { Animal, Enclosure, Task } from '@/types/db-types';
import { unstable_ViewTransition as ViewTransition } from 'react'
import { Button } from '@/components/ui/button';
import { Check, Loader2, TimerReset } from 'lucide-react';
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

export const hoursSinceDue = (task: Task): number => {
    return ((new Date().getTime() - (new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000)) / 1000 / 60 / 60);
}

export const hoursUntilDue = (task: Task) => {
    return ((new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000) - new Date().getTime()) / 1000 / 60 / 60;
}

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
                {task.complete ?
                    <>
                        <span className="text-stone-400 text-nowrap text-xs">-{ReadableTime(hoursUntilDue(task))}</span>
                        <CircularProgressbarWithChildren counterClockwise className="w-5 h-5 min-w-5 min-h-5 mr-1" styles={buildStyles({pathColor: "#047857", trailColor: "#292524"})} value={100-progress(task)} strokeWidth={16}>
                            {/* <TimerReset className="w-4 h-4 text-stone-900" /> */}
                        </CircularProgressbarWithChildren>
                    </>
                    :
                    hoursSinceDue(task) > 24 ? <span className="text-red-400 text-xs text-nowrap mr-1">{ReadableTime(hoursSinceDue(task))} overdue</span> : <span className="text-stone-400 text-nowrap text-xs">+{ReadableTime(hoursSinceDue(task))}</span>
                }
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
    if (Math.round((interval/8760)*10)/10 > 1) {
        return `${(interval / 8760).toFixed(1)} yrs`;
    } else if ((interval/8760).toFixed(1) === "1.0") {
        return `1 yr`;
    } else if (Math.round((interval/720)*10)/10 > 1) {
        return `${(interval / 720).toFixed(1)} mos`;
    } else if ((interval/720).toFixed(1) === "1.0") {
        return `1 mo`;
    } else if (Math.round((interval/168)*10)/10 > 1) {
        return `${(interval / 168).toFixed(1)} wks`;
    } else if ((interval/168).toFixed(1) === "1.0") {
        return `1 wk`;
    } else if (Math.round((interval/24)*10)/10 > 1) {
        return `${(interval / 24).toFixed(1)} d`;
    } else if ((interval/24).toFixed(1) === "1.0") {
        return `1 d`;
    } else if (Math.round((interval/1)*10)/10 > 1) {
        return `${interval.toFixed(1)} hrs`;
    } else if ((interval/1).toFixed(1) === "1.0") {
        return `1 hr`;
    } else {
        return `${(interval * 60).toFixed(1)} mins`;
    }
}

function TaskList({ tasks, animals, enclosures }: { tasks: Task[] | undefined, animals: Animal[] | undefined, enclosures: Enclosure[] | undefined }) {
    if (tasks && tasks.length === 0) {
        return <div>No tasks found... Maybe you&apos;re forgetting something?</div>
    }
    return (
        <Accordion type="single" collapsible className="w-full">
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
                    
                    // For complete tasks, sort by smallest hoursUntilDue first
                    if (a.complete && b.complete) {
                        return hoursUntilDue(a) - hoursUntilDue(b);
                    }
                    
                    return 0;
                })
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
                    <p><span className="font-bold text-stone-400">{task.complete ? "Resets On:" : "Was Due:"}</span> {new Date(new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000).toLocaleDateString()} {new Date(new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000).toLocaleTimeString()}</p>
                    {task.complete ? <p><span className="font-bold text-stone-400">Time Until Reset:</span> {ReadableTime(hoursUntilDue(task))}</p> : null}
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