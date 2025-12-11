"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Animal, Enclosure, Task } from "@/types/db-types";

type View = "home" | "family" | "tasks";

type NavigationTarget = {
  type: "animal" | "enclosure";
  id: number;
} | null;

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeView, setActiveView] = useState<View>("home");
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget>(null);
  const { data: animals, isPending: animalsPending } = useAnimals();
  const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
  const { data: tasks, isPending: tasksPending } = useTasks();
  const { data: species, isPending: speciesPending } = useSpecies();
  const { data: habitats, isPending: habitatsPending } = useHabitats();

  const [taskNavigationTarget, setTaskNavigationTarget] = useState<number | null>(null);
  const isDataLoaded = !animalsPending && !enclosuresPending && !tasksPending && !speciesPending && !habitatsPending;

  // Filter out memorialized animals and tasks associated with them
  const memorializedAnimalIds = useMemo(() => 
    new Set(
      animals?.filter((animal: Animal) => animal.isMemorialized).map((animal: Animal) => animal.animalId) ?? []
    ), [animals]
  );
  
  const filteredAnimals = useMemo(() => 
    animals?.filter((animal: Animal) => !animal.isMemorialized) ?? [], 
    [animals]
  );
  
  const filteredTasks = useMemo(() => 
    tasks?.filter((task: Task) => {
      // Exclude tasks associated with memorialized animals
      if (task.animalId && memorializedAnimalIds.has(task.animalId)) {
        return false;
      }
      return true;
    }) ?? [], 
    [tasks, memorializedAnimalIds]
  );

  // Handle URL parameters on mount and when data loads
  useEffect(() => {
    if (!isDataLoaded) return;

    const animalId = searchParams.get("animal");
    const enclosureId = searchParams.get("enclosure");
    const taskId = searchParams.get("task");

    if (animalId) {
      const id = parseInt(animalId, 10);
      if (!isNaN(id)) {
        const animal = filteredAnimals.find((a: Animal) => a.animalId === id);
        if (animal) {
          setNavigationTarget({ type: "animal", id });
          setActiveView("family");
        } else {
          toast("You don't have access to the requested animal.");
          // Remove invalid parameter from URL
          const params = new URLSearchParams(searchParams.toString());
          params.delete("animal");
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      }
    } else if (enclosureId) {
      const id = parseInt(enclosureId, 10);
      if (!isNaN(id)) {
        const enclosure = enclosures?.find((e: Enclosure) => e.enclosureId === id);
        if (enclosure) {
          setNavigationTarget({ type: "enclosure", id });
          setActiveView("family");
        } else {
          toast("You don't have access to the requested enclosure.");
          // Remove invalid parameter from URL
          const params = new URLSearchParams(searchParams.toString());
          params.delete("enclosure");
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      }
    } else if (taskId) {
      const id = parseInt(taskId, 10);
      if (!isNaN(id)) {
        const task = filteredTasks.find((t: Task) => t.taskId === id);
        if (task) {
          setTaskNavigationTarget(id);
          setActiveView("tasks");
        } else {
          toast("You don't have access to the requested task.");
          // Remove invalid parameter from URL
          const params = new URLSearchParams(searchParams.toString());
          params.delete("task");
          router.replace(`?${params.toString()}`, { scroll: false });
        }
      }
    } else {
      // No URL parameters - clear navigation targets
      setNavigationTarget(null);
      setTaskNavigationTarget(null);
    }
  }, [searchParams, isDataLoaded, filteredAnimals, enclosures, filteredTasks, router]);

  // Update URL when navigation target changes
  const handleNavigation = (type: "animal" | "enclosure", id: number) => {
    setNavigationTarget({ type, id });
    setActiveView("family");
    
    // Update URL
    const params = new URLSearchParams();
    params.set(type, id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle task navigation
  const handleTaskNavigation = (taskId: number) => {
    setTaskNavigationTarget(taskId);
    setActiveView("tasks");
    
    // Update URL
    const params = new URLSearchParams();
    params.set("task", taskId.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle navigation completion - keep URL params for back/forward navigation
  const handleNavigationComplete = () => {
    setNavigationTarget(null);
    // Don't clear URL parameters - keep them for browser back/forward navigation
  };

  // Handle task navigation completion
  const handleTaskNavigationComplete = () => {
    setTaskNavigationTarget(null);
    // Don't clear URL parameters - keep them for browser back/forward navigation
  };

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
            <TasksCard tasks={filteredTasks} isPending={tasksPending} onTaskClick={handleTaskNavigation}/>
            <SubjectSection 
              tasks={filteredTasks}
              enclosures={enclosures ?? []} 
              animals={filteredAnimals} 
              habitats={habitats ?? []} 
              species={species ?? []} 
              isPending={animalsPending || enclosuresPending || speciesPending || habitatsPending}
              onSubjectClick={handleNavigation}
            />
          </div>
        </div>

        {/* Family View */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out flex flex-col items-center"
          style={{ transform: getViewTransform("family") }}
        >
          <FamilyPage
            animals={filteredAnimals}
            enclosures={enclosures ?? []}
            tasks={filteredTasks}
            habitats={habitats ?? []}
            species={species ?? []}
            isPending={animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending}
            navigationTarget={navigationTarget}
            onNavigationComplete={handleNavigationComplete}
            onAnimalNavigation={(animalId) => handleNavigation("animal", animalId)}
            onTaskClick={handleTaskNavigation}
          />
        </div>

        {/* Tasks View */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-in-out flex flex-col items-center"
          style={{ transform: getViewTransform("tasks") }}
        >
          <TasksPage
            animals={filteredAnimals}
            enclosures={enclosures}
            tasks={filteredTasks}
            habitats={habitats}
            species={species}
            isPending={animalsPending || enclosuresPending || tasksPending || speciesPending || habitatsPending}
            onSubjectClick={handleNavigation}
            navigationTarget={taskNavigationTarget}
            onNavigationComplete={handleTaskNavigationComplete}
          />
        </div>
      </div>
      <NavBarGap />
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="max-w-md w-full pt-4 px-4">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
