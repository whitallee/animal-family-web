import { useAnimals, useEnclosures, useTasks } from "@/lib/api/fetch-family";
import { useHabitats, useSpecies } from "@/lib/api/fetch-species-habitats";
import { BookOpenText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from 'react'
import { FamilyListSkeleton } from "@/components/Skeletons";
import { Animal, Enclosure, Habitat, Species, Task } from "@/types/db-types";
import { animalToSubject, animalToSubjectLong } from "@/lib/helpers";
import { AnimalWithSpecies, AnimalSubjectLong } from "@/types/subject-types";
import { SubjectCircle } from "@/components/SubjectSection";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import moment from "moment";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import TasksCard from "@/components/TasksCard";

function AnimalItem({ animalShort }: { animalShort: AnimalWithSpecies }) {
    return (
        <div className="flex flex-row gap-2 items-center w-full">
            <SubjectCircle subject={animalShort} className="w-16 h-16 min-w-16 min-h-16 aspect-square my-2" />
            <div className="flex flex-col items-start">
                <h2 className="text-lg font-medium text-nowrap overflow-hidden text-ellipsis max-w-56 flex-nowrap">{animalShort.animalName}</h2>
                <p className="text-sm text-stone-400">{animalShort.species.speciesName}</p>
            </div>
        </div>
    )
}

function AnimalDetails({ animalLong }: { animalLong: AnimalSubjectLong }) {
    return (
            <div className="flex flex-col bg-stone-800 p-4 rounded-lg justify-between">
                <TasksCard tasks={animalLong.tasks} isPending={false} className="mb-2"/>
                <p><span className="font-bold text-stone-400">Common Name:</span> {animalLong.species.comName}</p>
                <div className="flex flex-row gap-2 items-center mb-2">
                    <span className="font-bold text-stone-400">Scientific Name:</span> {animalLong.species.sciName}
                    <Popover>
                        <PopoverTrigger><BookOpenText className="w-4 h-4 inline-block text-emerald-400" /></PopoverTrigger>
                        <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 text-sm">
                            <p>{animalLong.species.speciesDesc}</p>
                        </PopoverContent>
                    </Popover>
                </div>
                <p><span className="font-bold text-stone-400">Gender:</span> {animalLong.gender}</p>
                <p><span className="font-bold text-stone-400">Date of Birth:</span> {moment(new Date(animalLong.dob)).format('MM/DD/YYYY')} - {moment(new Date(animalLong.dob)).fromNow()}</p>
                <p className="mb-2"><span className="font-bold text-stone-400">Personality:</span> {animalLong.personalityDesc}</p>
                <p className=""><span className="font-bold text-stone-400">Diet:</span> {animalLong.dietDesc}</p>
                <p className=""><span className="font-bold text-stone-400">Routine:</span> {animalLong.routineDesc}</p>
                {animalLong.enclosure ?
                    <>
                        <p><span className="font-bold text-stone-400">Enclosure:</span> {animalLong.enclosure?.enclosureName}</p>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="font-bold text-stone-400">Habitat:</span> {animalLong.habitat?.habitatName}
                            <Popover>
                                <PopoverTrigger><BookOpenText className="w-4 h-4 inline-block text-emerald-400" /></PopoverTrigger>
                                <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 text-sm">
                                    <p>{animalLong.habitat?.habitatDesc}</p>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </>
                :
                    null
                }
                <p className="mt-2"><span className="font-bold text-stone-400">Extra Notes:</span> {animalLong.extraNotes}</p>
            </div>
    )
}

function AnimalList({ animals, enclosures, tasks, habitats, species }: { animals: Animal[], enclosures: Enclosure[], tasks: Task[], habitats: Habitat[], species: Species[] }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {animals.map((animal) => {
                const animalWithSpeciesLong = animalToSubjectLong(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks, enclosures, habitats);
                const animalWithSpeciesShort = animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks.filter(task => task.animalId === animal.animalId));
                return (
                    <AccordionItem value={animal.animalId.toString()} key={animal.animalId}>
                        <div className="flex items-center">
                            <AnimalItem animalShort={animalWithSpeciesShort} />
                            <AccordionTrigger className="flex-1" />
                        </div>
                        <AccordionContent>
                            <AnimalDetails animalLong={animalWithSpeciesLong} />
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

export default function FamilyPage() {
    const { data: animals, isPending: animalsPending } = useAnimals();
    const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
    const { data: tasks, isPending: tasksPending } = useTasks();
    const { data: habitats, isPending: habitatsPending } = useHabitats();
    const { data: species, isPending: speciesPending } = useSpecies();

    return (
        <ViewTransition name="family">
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-2xl font-medium">Family ({animals?.length || 0})</h1>
                    <Link href="/" className="w-6 h-6 p-0"><ChevronLeft className="w-6 h-6" /></Link>
                </div>
                {animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending ? <FamilyListSkeleton /> : <AnimalList animals={animals || []} enclosures={enclosures || []} tasks={tasks || []} habitats={habitats || []} species={species || []} />}
            </div>
        </ViewTransition>
    );
}