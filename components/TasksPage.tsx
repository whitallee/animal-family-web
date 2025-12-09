"use client"

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
import { CalendarDays, Check, Loader2, TriangleAlert } from 'lucide-react';

// API Hooks
import { useMarkTaskComplete, useMarkTaskIncomplete } from '@/lib/api/task-mutations';

// Types
import { Animal, Enclosure, Habitat, Species, Task } from '@/types/db-types';
import { Subject } from "@/types/subject-types";

// Utilities
import { animalToSubject, enclosureToSubject, ReadableTime, hoursSinceDue, hoursUntilDue, dateDue } from "@/lib/helpers";

function TaskItem({ task }: { task: Task }) {    
    const markComplete = useMarkTaskComplete();
    const markIncomplete = useMarkTaskIncomplete();
    return (
            <div className="w-full flex items-center gap-2">
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
                     {markComplete.isPending || markIncomplete.isPending ? (
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
                                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 w-fit">
                                        <span className="text-nowrap">Resets on {moment(dateDue(task)).format('MMMM Do YYYY, h:mm a')}</span>
                                        <br />
                                        <span className="text-nowrap">Completed {moment(task.lastCompleted).format('MMMM Do YYYY, h:mm a')}</span>
                                    </PopoverContent>
                                </Popover>
                            </p>
                        :
                            <p><span className="font-bold text-stone-400">Reset</span><span className="ml-1">{ReadableTime(hoursSinceDue(task))} ago</span>
                                <Popover>
                                    <PopoverTrigger><CalendarDays className="w-4 h-4 inline-block -translate-y-0.5 text-emerald-400 ml-2" /></PopoverTrigger>
                                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 w-fit">
                                        <span className="text-nowrap">Reset on {moment(dateDue(task)).format('MMMM Do YYYY, h:mm a')}</span>
                                        <br />
                                        <span className="text-nowrap">Completed {moment(task.lastCompleted).format('MMMM Do YYYY, h:mm a')}</span>
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

    const categorizeTasks = (tasks: Task[]) => {
        const categories = {
            'incomplete': [] as Task[],
            'resets within 6 hours': [] as Task[],
            '6-12 hours from now': [] as Task[],
            '12-24 hours from now': [] as Task[],
            'within a week': [] as Task[],
            'within a month': [] as Task[],
            'within 3 months': [] as Task[],
            'within a year': [] as Task[]
        };

        tasks.forEach(task => {
            if (task.complete) {
                const hoursUntil = hoursUntilDue(task);
                if (hoursUntil <= 6) {
                    categories['resets within 6 hours'].push(task);
                } else if (hoursUntil <= 12) {
                    categories['6-12 hours from now'].push(task);
                } else if (hoursUntil <= 24) {
                    categories['12-24 hours from now'].push(task);
                } else if (hoursUntil <= 168) { // 7 days
                    categories['within a week'].push(task);
                } else if (hoursUntil <= 720) { // 30 days
                    categories['within a month'].push(task);
                } else if (hoursUntil <= 2160) { // 90 days
                    categories['within 3 months'].push(task);
                } else if (hoursUntil <= 8760) { // 365 days
                    categories['within a year'].push(task);
                }
            } else {
                // All incomplete tasks go to the incomplete section
                categories['incomplete'].push(task);
            }
        });

        return categories;
    };

    const renderTaskSection = (title: string, tasksInSection: Task[]) => {
        if (tasksInSection.length === 0) return null;

        const sortedTasks = [...tasksInSection].sort((a, b) => {
            // For incomplete tasks, sort by highest hoursSinceDue first (most overdue first)
            if (!a.complete && !b.complete) {
                return hoursSinceDue(b) - hoursSinceDue(a);
            }
            
            // For complete tasks, sort by smallest hoursUntilDue first
            if (a.complete && b.complete) {
                return hoursUntilDue(a) - hoursUntilDue(b);
            }
            
            return 0;
        });

        return (
            <div key={title} className="w-full">
                <h3 className="text-lg font-semibold text-stone-500 mb-2 mt-4 first:mt-0">{title}</h3>
                <Accordion type="single" collapsible className="w-full">
                    {sortedTasks.map((task) => (
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
            </div>
        );
    };

    const categorizedTasks = categorizeTasks(tasks || []);
    
    return (
        <div className="w-full">
            {renderTaskSection('Incomplete', categorizedTasks['incomplete'])}
            {renderTaskSection('Resets within 6 hours', categorizedTasks['resets within 6 hours'])}
            {renderTaskSection('Resets within 6-12 hours', categorizedTasks['6-12 hours from now'])}
            {renderTaskSection('Resets within 12-24 hours', categorizedTasks['12-24 hours from now'])}
            {renderTaskSection('Resets within a week', categorizedTasks['within a week'])}
            {renderTaskSection('Resets within a month', categorizedTasks['within a month'])}
            {renderTaskSection('Resets within 3 months', categorizedTasks['within 3 months'])}
            {renderTaskSection('Resets within a year', categorizedTasks['within a year'])}
        </div>
    );
}
interface TasksPageProps {
    animals: Animal[] | undefined;
    enclosures: Enclosure[] | undefined;
    tasks: Task[] | undefined;
    habitats: Habitat[] | undefined;
    species: Species[] | undefined;
    isPending: boolean;
}

export default function TasksPage({ animals, enclosures, tasks, habitats, species, isPending }: TasksPageProps) {
    return (
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-2xl font-medium">Tasks</h1>
                </div>
                {isPending ? <TaskListSkeleton /> : <TaskList tasks={tasks} animals={animals} enclosures={enclosures} habitats={habitats} species={species} />}
            </div>
    );
}