"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
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
import { Animal, Task } from "@/types/db-types";
import { useAuth } from "@/lib/AuthContext";
import { useMarkTaskComplete } from "@/lib/api/task-mutations";

type View = "home" | "family" | "tasks";

type NavigationTarget = {
  type: "animal" | "enclosure";
  id: number;
} | null;

function HomeContent() {
  const [activeView, setActiveView] = useState<View>("home");
  const [navigationTarget, setNavigationTarget] = useState<NavigationTarget>(null);
  const { data: animals, isPending: animalsPending } = useAnimals();
  const { data: enclosures, isPending: enclosuresPending } = useEnclosures();
  const { data: tasks, isPending: tasksPending } = useTasks();
  const { data: species, isPending: speciesPending } = useSpecies();
  const { data: habitats, isPending: habitatsPending } = useHabitats();
  const { user, token } = useAuth();
  const markTaskComplete = useMarkTaskComplete();

  const [taskNavigationTarget, setTaskNavigationTarget] = useState<number | null>(null);

  // Listen for service worker messages (push notification actions)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'complete-task') {
          const taskId = event.data.taskId;

          try {
            // Find the task to get its full data
            const task = tasks?.find((t: Task) => t.taskId === taskId);
            if (!task) {
              console.error('[App] Task not found:', taskId);
              return;
            }

            // Goes through the same mutation the Tasks view uses, so completing
            // from a notification and completing in the app cannot drift apart.
            // This was previously a hand-rolled fetch that duplicated the
            // request and invalidated the task list itself.
            await markTaskComplete.mutateAsync(task);
          } catch (error) {
            console.error('[App] Error completing task:', error);
          }
        } else if (event.data.type === 'navigate-to-task') {
          const taskId = event.data.taskId;
          // Navigate to the task in the Tasks view
          handleTaskNavigation(taskId);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };
    }
  }, [tasks, token, user, markTaskComplete]);

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

  // Handle navigation
  const handleNavigation = (type: "animal" | "enclosure", id: number) => {
    setNavigationTarget({ type, id });
    setActiveView("family");
  };

  // Handle task navigation
  const handleTaskNavigation = (taskId: number) => {
    setTaskNavigationTarget(taskId);
    setActiveView("tasks");
  };

  // Handle navigation completion
  const handleNavigationComplete = () => {
    setNavigationTarget(null);
  };

  // Handle task navigation completion
  const handleTaskNavigationComplete = () => {
    setTaskNavigationTarget(null);
  };

  // Handle view change from bottom nav
  const handleViewChange = (view: View) => {
    setActiveView(view);
    setNavigationTarget(null);
    setTaskNavigationTarget(null);
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
            onAccordionChange={(type, id) => {
              if (id !== null) {
                handleNavigation(type, id);
              } else {
                setNavigationTarget(null);
              }
            }}
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
            onAccordionChange={(taskId) => {
              if (taskId !== null) {
                handleTaskNavigation(taskId);
              } else {
                setTaskNavigationTarget(null);
              }
            }}
          />
        </div>
      </div>
      <NavBarGap />
      <BottomNav activeView={activeView} onViewChange={handleViewChange} />
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
