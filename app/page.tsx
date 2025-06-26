"use client";

import BottomNav from "@/components/nav/BottomNav";
import NavBarGap from "@/components/nav/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { useEnclosures, useAnimals } from "@/lib/api/fetch-family";
import { useTasks } from "@/lib/api/fetch-family";
import { useHabitats } from "@/lib/api/fetch-species-habitats";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
import { unstable_ViewTransition as ViewTransition } from 'react'

export default function Home() {
  const { data: animals, isPending: animalsPending } = useAnimals();
  const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
  const { data: tasks, isPending: tasksPending } = useTasks();
  const { data: species, isPending: speciesPending } = useSpecies();
  const { data: habitats, isPending: habitatsPending } = useHabitats();

  return (
    <div className="max-w-md w-full pt-4 px-4 overflow-y-hidden">
      <ViewTransition name="tasks">
        <TasksCard tasks={tasks} isPending={tasksPending} home/>
      </ViewTransition>
      {/* TasksPage */}
      <SubjectSection 
        tasks={tasks ?? []}
        enclosures={enclosures ?? []} 
        animals={animals ?? []} 
        habitats={habitats ?? []} 
        species={species ?? []} 
        isPending={animalsPending || enclosuresPending || speciesPending || habitatsPending} 
      />
      {/* SubjectInfoPage */}
      <NavBarGap />
      <BottomNav />
    </div>
  );
}
