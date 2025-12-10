import { BookOpenText, Loader2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { EditAnimalButton } from "@/components/EditComponents";
import { DeleteAnimalButton } from "./DeleteComponents";

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

function AnimalDetails({ animalLong, animal, onTaskClick }: { animalLong: AnimalSubjectLong, animal: Animal, onTaskClick?: (taskId: number) => void }) {
    return (
        <>
        <div className="flex flex-col bg-stone-800 p-4 rounded-lg justify-between">
            <TasksCard tasks={animalLong.tasks} isPending={false} className="mb-2" onTaskClick={onTaskClick}/>
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
        <div className="mt-4 flex gap-2">
            <EditAnimalButton animal={animal} />
            <DeleteAnimalButton />
        </div>
        </>
    )
}

function AnimalList({ animals, enclosures, tasks, habitats, species, navigationTarget, onNavigationComplete, openAnimalId, onOpenAnimalChange, onTaskClick }: { animals: Animal[], enclosures: Enclosure[], tasks: Task[], habitats: Habitat[], species: Species[], navigationTarget?: { type: "animal" | "enclosure", id: number } | null, onNavigationComplete?: () => void, openAnimalId?: number, onOpenAnimalChange?: (id: number | undefined) => void, onTaskClick?: (taskId: number) => void }) {
    const [openValue, setOpenValue] = useState<string>("");

    useEffect(() => {
        if (navigationTarget?.type === "animal" && navigationTarget.id) {
            setOpenValue(navigationTarget.id.toString());
            onOpenAnimalChange?.(navigationTarget.id);
            // Scroll to the element after a short delay to ensure it's rendered
            setTimeout(() => {
                const element = document.querySelector(`[data-accordion-item="${navigationTarget.id}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                onNavigationComplete?.();
            }, 100);
        }
    }, [navigationTarget, onNavigationComplete, onOpenAnimalChange]);

    useEffect(() => {
        if (openAnimalId !== undefined) {
            setOpenValue(openAnimalId.toString());
            setTimeout(() => {
                const element = document.querySelector(`[data-accordion-item="${openAnimalId}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        } else {
            setOpenValue("");
        }
    }, [openAnimalId]);

    return (
        <Accordion type="single" collapsible className="w-full" value={openValue} onValueChange={setOpenValue}>
            {animals.map((animal) => {
                const animalWithSpeciesLong = animalToSubjectLong(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks, enclosures, habitats);
                const animalWithSpeciesShort = animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks.filter(task => task.animalId === animal.animalId));
                return (
                    <AccordionItem value={animal.animalId.toString()} key={animal.animalId} className="w-full" data-accordion-item={animal.animalId}>
                        <div className="flex items-center w-full">
                            <AnimalItem animalShort={animalWithSpeciesShort} />
                            <AccordionTrigger className="flex-1" />
                        </div>
                        <AccordionContent>
                            <AnimalDetails animalLong={animalWithSpeciesLong} animal={animal} onTaskClick={onTaskClick} />
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

function EnclosureDetails({ enclosureLong, onAnimalClick, onTaskClick }: { enclosureLong: EnclosureSubjectLong, onAnimalClick?: (animalId: number) => void, onTaskClick?: (taskId: number) => void }) {
    return (
        <div className="flex flex-col bg-stone-800 p-4 rounded-lg justify-between">
            <TasksCard tasks={enclosureLong.tasks} isPending={false} className="mb-2" onTaskClick={onTaskClick}/>
            {/* <p><span className="font-bold text-stone-400">Enclosure:</span> {enclosureLong.enclosureName}</p> */}
            <div className="flex flex-col gap-2 my-1.5 border-b border-stone-500 pb-2">
                {enclosureLong.animals.map((animal) => (
                    <div 
                        key={animal.animalId} 
                        className={`flex flex-row gap-2 items-center ${onAnimalClick ? "cursor-pointer" : ""}`}
                        onClick={() => onAnimalClick?.(animal.animalId)}
                    >
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

function EnclosureList({ enclosures, animals, tasks, habitats, species, navigationTarget, onNavigationComplete, onAnimalClick, onTaskClick }: { enclosures: Enclosure[], animals: Animal[], tasks: Task[], habitats: Habitat[], species: Species[], navigationTarget?: { type: "animal" | "enclosure", id: number } | null, onNavigationComplete?: () => void, onAnimalClick?: (animalId: number) => void, onTaskClick?: (taskId: number) => void }) {
    const [openValue, setOpenValue] = useState<string>("");

    useEffect(() => {
        if (navigationTarget?.type === "enclosure" && navigationTarget.id) {
            setOpenValue(navigationTarget.id.toString());
            // Scroll to the element after a short delay to ensure it's rendered
            setTimeout(() => {
                const element = document.querySelector(`[data-accordion-item="${navigationTarget.id}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                onNavigationComplete?.();
            }, 100);
        }
    }, [navigationTarget, onNavigationComplete]);

    return (
        <Accordion type="single" collapsible className="w-full" value={openValue} onValueChange={setOpenValue}>
            {enclosures.map((enclosure) => {
                const enclosureWithDataLong = enclosureToSubjectLong(enclosure, animals, tasks, habitats, species);
                const enclosureWithDataShort = enclosureToSubject(enclosure, animals, habitats, species, tasks);
                return (
                    <AccordionItem value={enclosure.enclosureId.toString()} key={enclosure.enclosureId} className="w-full" data-accordion-item={enclosure.enclosureId}>
                        <div className="flex items-center w-full">
                            <EnclosureItem enclosureShort={enclosureWithDataShort} />
                            <AccordionTrigger className="flex-1" />
                        </div>
                        <AccordionContent>
                            <EnclosureDetails enclosureLong={enclosureWithDataLong} onAnimalClick={onAnimalClick} onTaskClick={onTaskClick} />
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}

interface FamilyPageProps {
    animals: Animal[];
    enclosures: Enclosure[];
    tasks: Task[];
    habitats: Habitat[];
    species: Species[];
    isPending: boolean;
    navigationTarget?: { type: "animal" | "enclosure", id: number } | null;
    onNavigationComplete?: () => void;
    onAnimalNavigation?: (animalId: number) => void;
    onTaskClick?: (taskId: number) => void;
}

export default function FamilyPage({ animals, enclosures, tasks, habitats, species, isPending, navigationTarget, onNavigationComplete, onAnimalNavigation, onTaskClick }: FamilyPageProps) {
    const [activeTab, setActiveTab] = useState<string>("animals");
    const [openAnimalId, setOpenAnimalId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (navigationTarget) {
            if (navigationTarget.type === "animal") {
                setActiveTab("animals");
            } else if (navigationTarget.type === "enclosure") {
                setActiveTab("enclosures");
            }
        }
    }, [navigationTarget]);

    const handleAnimalClick = (animalId: number) => {
        // Switch to animals tab and navigate to the animal
        setActiveTab("animals");
        setOpenAnimalId(animalId);
        // Update URL via parent callback
        onAnimalNavigation?.(animalId);
    };

    return (
            <div className="h-[calc(100vh-6rem)] w-full flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 overflow-y-scroll">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-stone-800 text-stone-50 w-full">
                        <TabsTrigger value="animals" className="text-stone-400 data-[state=active]:text-stone-900">Animals {isPending ? <Loader2 className="animate-spin"/> : ("(" + animals?.length + ")") || "(0)"}</TabsTrigger>
                        <TabsTrigger value="enclosures" className="text-stone-400 data-[state=active]:text-stone-900">Enclosures {isPending ? <Loader2 className="animate-spin"/> : ("(" + enclosures?.length + ")") || "(0)"}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="animals">
                    {isPending ?
                        <FamilyListSkeleton />
                        : 
                        <AnimalList animals={animals || []} enclosures={enclosures || []} tasks={tasks || []} habitats={habitats || []} species={species || []} navigationTarget={navigationTarget} onNavigationComplete={onNavigationComplete} openAnimalId={openAnimalId} onOpenAnimalChange={setOpenAnimalId} onTaskClick={onTaskClick} />}
                    </TabsContent>

                    <TabsContent value="enclosures">
                        {isPending ?
                            <FamilyListSkeleton />
                            :
                            <EnclosureList enclosures={enclosures || []} animals={animals || []} tasks={tasks || []} habitats={habitats || []} species={species || []} navigationTarget={navigationTarget} onNavigationComplete={onNavigationComplete} onAnimalClick={handleAnimalClick} onTaskClick={onTaskClick} />
                        }
                    </TabsContent>
                </Tabs>
            </div>
    );
}