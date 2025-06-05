"use client";

import BottomNav from "@/components/BottomNav";
import NavBarGap from "@/components/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();
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
