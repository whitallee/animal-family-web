// import { useAnimals, useEnclosures, useTasks } from "@/lib/api/fetch-family";
// import { useHabitats, useSpecies } from "@/lib/api/fetch-species-habitats";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from 'react'
import { FamilyListSkeleton } from "./Skeletons";

export default function FamilyPage() {
    // const { data: animals, isPending: animalsPending } = useAnimals();
    // const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
    // const { data: tasks, isPending: tasksPending } = useTasks();
    // const { data: habitats, isPending: habitatsPending } = useHabitats();
    // const { data: species, isPending: speciesPending } = useSpecies();

    return (
        <ViewTransition name="family">
            <div className="h-[calc(100vh-5rem)] w-[calc(100%-1rem)] flex flex-col gap-4 items-start bg-stone-700 text-stone-50 shadow-lg border-stone-600 rounded-lg p-4 mt-2 overflow-y-scroll">
                <div className="flex flex-row justify-between items-center w-full">
                    <h1 className="text-2xl font-medium">Family</h1>
                    <Link href="/" className="w-6 h-6 p-0"><ChevronLeft className="w-6 h-6" /></Link>
                </div>
                {/* {animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending ? <FamilyListSkeleton /> : <FamilyList tasks={tasks} animals={animals} enclosures={enclosures} habitats={habitats} species={species} />} */}
                <FamilyListSkeleton />
            </div>
        </ViewTransition>
    );
}