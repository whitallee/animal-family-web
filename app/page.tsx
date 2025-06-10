"use client";

import BottomNav from "@/components/BottomNav";
import NavBarGap from "@/components/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { useEnclosures, useAnimals } from "@/lib/api/fetch-family";
import { useTasks } from "@/lib/api/fetch-family";
import { useHabitats } from "@/lib/api/fetch-species-habitats";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
// import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  // const { isLoggedIn } = useAuth();
  const { data: animals, isPending: animalsPending } = useAnimals();
  const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
  const { data: tasks, isPending: tasksPending } = useTasks();
  const { data: species, isPending: speciesPending } = useSpecies();
  const { data: habitats, isPending: habitatsPending } = useHabitats();

  // if (isLoggedIn) {
  //   console.log('animals', animals);
  //   console.log('enclosures', enclosures);
  //   console.log('tasks', tasks);
  //   console.log('species', species);
  //   console.log('habitats', habitats);
  // }
  return (
    <div className="max-w-md w-full pt-4 px-4 overflow-y-hidden">
      <TasksCard tasks={tasks} isPending={tasksPending} />
      {/* TasksPage */}
      <SubjectSection 
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
