import { useAnimals, useEnclosures, useTasks } from "@/lib/api/fetch-family";
import { useHabitats, useSpecies } from "@/lib/api/fetch-species-habitats";
import { BookOpenText, Loader2 } from "lucide-react";
import { unstable_ViewTransition as ViewTransition } from 'react'
import { FamilyListSkeleton } from "@/components/Skeletons";
import { Animal, Enclosure, Habitat, Species, Task } from "@/types/db-types";
import { animalToSubject, animalToSubjectLong, enclosureToSubject, enclosureToSubjectLong } from "@/lib/helpers";
import { AnimalWithSpecies, AnimalSubjectLong, EnclosureSubjectLong, EnclosureWithData } from "@/types/subject-types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TasksCard from "@/components/TasksCard";

function AnimalItem({ animalShort }: { animalShort: AnimalWithSpecies }) {
    return (
        <div className="flex flex-row gap-2 items-center w-full">
            <SubjectCircle smallAnimalIcons subject={animalShort} className="w-16 h-16 min-w-16 min-h-16 aspect-square my-2" />
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
            <div className="flex flex-row gap-2 items-center mb-2">
                <span className="font-bold text-stone-400">Species:</span> {animalLong.species.comName}
                <Popover>
                    <PopoverTrigger><BookOpenText className="w-4 h-4 inline-block text-emerald-400" /></PopoverTrigger>
                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 text-sm">
                        <p className="mb-1">Scientific Name: {animalLong.species.sciName}</p>
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
                    <AccordionItem value={animal.animalId.toString()} key={animal.animalId} className="w-full">
                        <div className="flex items-center w-full">
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

function EnclosureItem({ enclosureShort }: { enclosureShort: EnclosureWithData }) {
    return (
        <div className="flex flex-row gap-2 items-center w-full">
            <SubjectCircle smallAnimalIcons enclosureFocus subject={enclosureShort} className="w-16 h-16 min-w-16 min-h-16 aspect-square my-2" />
            <div className="flex flex-col items-start">
                <h2 className="text-lg font-medium text-nowrap overflow-hidden text-ellipsis max-w-56 flex-nowrap">{enclosureShort.enclosureName}</h2>
                <p className="text-sm text-stone-400">{enclosureShort.habitat.habitatName}</p>
            </div>
        </div>
    )
}

function EnclosureDetails({ enclosureLong }: { enclosureLong: EnclosureSubjectLong }) {
    return (
        <div className="flex flex-col bg-stone-800 p-4 rounded-lg justify-between">
            <TasksCard tasks={enclosureLong.tasks} isPending={false} className="mb-2"/>
            {/* <p><span className="font-bold text-stone-400">Enclosure:</span> {enclosureLong.enclosureName}</p> */}
            <div className="flex flex-col gap-2 my-1.5 border-b border-stone-500 pb-2">
                {enclosureLong.animals.map((animal) => (
                    <div key={animal.animalId} className="flex flex-row gap-2 items-center">
                        <SubjectCircle smallAnimalIcons subject={animal} className="w-10 h-10 min-w-10 min-h-10 aspect-square" />
                        <div className="flex flex-col items-start">
                            <h2 className="text-lg font-medium text-nowrap overflow-hidden text-ellipsis max-w-56 flex-nowrap">{animal.animalName}</h2>
                            <p className="text-sm text-stone-400">{animal.species.speciesName}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-row gap-2 items-center">
                <span className="font-bold text-stone-400">Habitat:</span> {enclosureLong.habitat.habitatName}
                <Popover>
                    <PopoverTrigger><BookOpenText className="w-4 h-4 inline-block text-emerald-400" /></PopoverTrigger>
                    <PopoverContent className="bg-stone-700 text-stone-50 p-2 rounded-lg border-stone-500 text-sm">
                        <p>{enclosureLong.habitat.habitatDesc}</p>
                    </PopoverContent>
                </Popover>
            </div>
            <p><span className="font-bold text-stone-400">Extra Notes:</span> {enclosureLong.notes}</p>
        </div>
    )
}

function EnclosureList({ enclosures, animals, tasks, habitats, species }: { enclosures: Enclosure[], animals: Animal[], tasks: Task[], habitats: Habitat[], species: Species[] }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {enclosures.map((enclosure) => {
                const enclosureWithDataLong = enclosureToSubjectLong(enclosure, animals, tasks, habitats, species);
                const enclosureWithDataShort = enclosureToSubject(enclosure, animals, habitats, species, tasks);
                return (
                    <AccordionItem value={enclosure.enclosureId.toString()} key={enclosure.enclosureId} className="w-full">
                        <div className="flex items-center w-full">
                            <EnclosureItem enclosureShort={enclosureWithDataShort} />
                            <AccordionTrigger className="flex-1" />
                        </div>
                        <AccordionContent>
                            <EnclosureDetails enclosureLong={enclosureWithDataLong} />
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
                <Tabs defaultValue="animals" className="w-full">
                    <TabsList className="bg-stone-800 text-stone-50 w-full">
                        <TabsTrigger value="animals" className="text-stone-400 data-[state=active]:text-stone-900">Animals {animalsPending ? <Loader2 className="animate-spin"/> : ("(" + animals?.length + ")") || "(0)"}</TabsTrigger>
                        <TabsTrigger value="enclosures" className="text-stone-400 data-[state=active]:text-stone-900">Enclosures {enclosuresPending ? <Loader2 className="animate-spin"/> : ("(" + enclosures?.length + ")") || "(0)"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="animals">
                    {animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending ?
                        <FamilyListSkeleton />
                        : 
                        <AnimalList animals={animals || []} enclosures={enclosures || []} tasks={tasks || []} habitats={habitats || []} species={species || []} />}
                    </TabsContent>

                    <TabsContent value="enclosures">
                        {enclosuresPending || animalsPending || tasksPending || speciesPending || habitatsPending ?
                            <FamilyListSkeleton />
                            :
                            <EnclosureList enclosures={enclosures || []} animals={animals || []} tasks={tasks || []} habitats={habitats || []} species={species || []} />
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </ViewTransition>
    );
}