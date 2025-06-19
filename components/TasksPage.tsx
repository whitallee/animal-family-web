"use client"

import { unstable_ViewTransition as ViewTransition } from 'react'
import Link from "next/link";
import moment from 'moment';

// UI Components
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { SubjectCircle } from "./SubjectSection";
import { TaskListSkeleton } from "@/components/Skeletons";

// Icons
import { CalendarDays, Check, ChevronLeft, Loader2, TriangleAlert } from 'lucide-react';

// API Hooks
import { useMarkTaskComplete } from '@/lib/api/task-mutations';
import { useAnimals, useEnclosures, useTasks } from '@/lib/api/fetch-family';
import { useSpecies, useHabitats } from "@/lib/api/fetch-species-habitats";

// Types
import { Animal, Enclosure, Habitat, Species, Task } from '@/types/db-types';
import { Subject } from "@/types/subject-types";

// Utilities
import { animalToSubject, enclosureToSubject, ReadableTime, hoursSinceDue, hoursUntilDue, dateDue } from "@/lib/helpers";

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
                    null
                    :
                    hoursSinceDue(task) > 24 ? <TriangleAlert className="w-5 h-5 text-red-400 mr-2" /> : null
                }
            </div>
    )
}

function TaskDetails({ task, animals, enclosures, habitats, species, tasks }: { task: Task, animals: Animal[] | undefined, enclosures: Enclosure[] | undefined, habitats: Habitat[] | undefined, species: Species[] | undefined, tasks: Task[] | undefined }) {
    let subject: Subject | undefined;
    if (!animals || !enclosures || !habitats || !species) {
        return <div>No subject found...</div>
    }

    if (task.animalId) {
        subject = animalToSubject(animals.find(animal => animal.animalId === task.animalId)!, species.find(species => species.speciesId === animals.find(animal => animal.animalId === task.animalId)!.speciesId)!, tasks?.filter(task => task.animalId === task.animalId) || []);
    } else if (task.enclosureId) {
        subject = enclosureToSubject(enclosures.find(enclosure => enclosure.enclosureId === task.enclosureId)!, animals, habitats, species, tasks?.filter(task => task.enclosureId === task.enclosureId) || []);
    }

    if (!subject) {
        return <div>No subject found...</div>
    }

    return (
        <>
            <div className="flex flex-row gap-4 bg-stone-800 p-4 rounded-lg">
                <div className="flex flex-col gap-2 items-center text-center max-w-24">
                    <SubjectCircle subject={subject as Subject} className="w-24 h-24" />
                    <p className="text-stone-400 font-bold">{"animalName" in subject ? subject.animalName : subject.enclosureName}</p>
                </div>
                <div className="flex flex-col justify-between">
                    <p><span className="font-bold text-stone-400">Description:</span> {task.taskDesc}</p>
                    <p><span className="font-bold text-stone-400">Repeats every </span> {ReadableTime(task.repeatIntervHours)}</p>

                    {
                        task.complete ?
                            <p className="w-full"><span className="font-bold text-stone-400">Resets in</span> {ReadableTime(hoursUntilDue(task))}
                                <Popover>
                                    <PopoverTrigger><CalendarDays className="w-4 h-4 inline-block -translate-y-0.5 text-emerald-400 ml-2" /></PopoverTrigger>
                                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500">
                                        <p>Resets on {moment(dateDue(task)).format('MMMM Do YYYY, h:mm a')}</p>
                                        <p className="text-nowrap">Completed {moment(task.lastCompleted).format('MMMM Do YYYY, h:mm a')}</p>
                                    </PopoverContent>
                                </Popover>
                            </p>
                        :
                            <p><span className="font-bold text-stone-400">Reset</span><span className="ml-1">{ReadableTime(hoursSinceDue(task))} ago</span>
                                <Popover>
                                    <PopoverTrigger><CalendarDays className="w-4 h-4 inline-block -translate-y-0.5 text-emerald-400 ml-2" /></PopoverTrigger>
                                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500">
                                        <p>Reset on {moment(dateDue(task)).format('MMMM Do YYYY, h:mm a')}</p>
                                        <p className="text-nowrap">Completed {moment(task.lastCompleted).format('MMMM Do YYYY, h:mm a')}</p>
                                    </PopoverContent>
                                </Popover>
                            </p>
                    }
                </div>
            </div>
        </>
    )
}

function TaskList({ tasks, animals, enclosures, habitats, species }: { tasks: Task[] | undefined, animals: Animal[] | undefined, enclosures: Enclosure[] | undefined, habitats: Habitat[] | undefined, species: Species[] | undefined }) {
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
                    <TaskDetails task={task} animals={animals} enclosures={enclosures} habitats={habitats} species={species} tasks={tasks} />
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
    const { data: habitats, isPending: habitatsPending } = useHabitats();
    const { data: species, isPending: speciesPending } = useSpecies();

    // console.log(organizeAnimalFamily(enclosures || [], animals || [], habitats || [], species || []));
    return (
        <ViewTransition name="tasks">
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-2xl font-medium">Tasks</h1>
                    <Link href="/" className="w-6 h-6 p-0"><ChevronLeft className="w-6 h-6" /></Link>
                </div>
                {animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending ? <TaskListSkeleton /> : <TaskList tasks={tasks} animals={animals} enclosures={enclosures} habitats={habitats} species={species} />}
            </div>
        </ViewTransition>
    );
}