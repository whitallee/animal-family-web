"use client";

import { useState } from "react";
import BottomNav from "@/components/nav/BottomNav";
import NavBarGap from "@/components/nav/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import FamilyPage from "@/components/FamilyPage";
import TasksPage from "@/components/TasksPage";
import { useEnclosures, useAnimals } from "@/lib/api/fetch-family";
import { useTasks } from "@/lib/api/fetch-family";
import { useHabitats } from "@/lib/api/fetch-species-habitats";
import { useSpecies } from "@/lib/api/fetch-species-habitats";

type View = "home" | "family" | "tasks";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("home");
  const { data: animals, isPending: animalsPending } = useAnimals();
  const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
  const { data: tasks, isPending: tasksPending } = useTasks();
  const { data: species, isPending: speciesPending } = useSpecies();
  const { data: habitats, isPending: habitatsPending } = useHabitats();

  const getViewTransform = (view: View) => {
    if (activeView === view) return "translateX(0)";
    
    // Family slides in from left, so when not active it's off to the left
    if (view === "family") return "translateX(-100%)";
    
    // Tasks slides in from right, so when not active it's off to the right
    if (view === "tasks") return "translateX(100%)";
    
    // Home slides from opposite direction based on where we're coming from
    if (view === "home") {
      if (activeView === "family") return "translateX(100%)"; // coming from left, so home slides from right
      if (activeView === "tasks") return "translateX(-100%)"; // coming from right, so home slides from left
    }
    
    return "translateX(0)";
  };

  return (
    <div className="max-w-md w-full pt-4 px-4 overflow-hidden relative">
      <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
        {/* Home View */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{ transform: getViewTransform("home") }}
        >
          <div className="h-full overflow-y-auto">
            <TasksCard tasks={tasks} isPending={tasksPending} home/>
            <SubjectSection 
              tasks={tasks ?? []}
              enclosures={enclosures ?? []} 
              animals={animals ?? []} 
              habitats={habitats ?? []} 
              species={species ?? []} 
              isPending={animalsPending || enclosuresPending || speciesPending || habitatsPending} 
            />
          </div>
        </div>

        {/* Family View */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out flex flex-col items-center"
          style={{ transform: getViewTransform("family") }}
        >
          <FamilyPage
            animals={animals ?? []}
            enclosures={enclosures ?? []}
            tasks={tasks ?? []}
            habitats={habitats ?? []}
            species={species ?? []}
            isPending={animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending}
          />
        </div>

        {/* Tasks View */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out flex flex-col items-center"
          style={{ transform: getViewTransform("tasks") }}
        >
          <TasksPage
            animals={animals}
            enclosures={enclosures}
            tasks={tasks}
            habitats={habitats}
            species={species}
            isPending={animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending}
          />
        </div>
      </div>
      <NavBarGap />
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}
