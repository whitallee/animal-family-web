"use client";

import BottomNav from "@/components/BottomNav";
import NavBarGap from "@/components/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { useEnclosures, useAnimals } from "@/lib/api/fetch-family";
import { useTasks } from "@/lib/api/fetch-family";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { data: animals } = useAnimals();
  const { data: enclosures } = useEnclosures();
  const { data: tasks } = useTasks();

  if (isLoggedIn) {
    // console.log('animals', animals);
    // console.log('enclosures', enclosures);
    console.log('tasks', tasks); // currently empty so not worrying about it
  }
  return (
    <div className="max-w-md w-full pt-4 px-4 overflow-y-hidden">
      <h1>{isLoggedIn ? "Logged in" : "Logged out"}</h1>
      <TasksCard />
      {/* TasksPage */}
      <SubjectSection />
      {/* SubjectInfoPage */}
      <NavBarGap />
      <BottomNav />
    </div>
  );
}
