"use client";

import BottomNav from "@/components/BottomNav";
import NavBarGap from "@/components/NavBarGap";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { useLogin } from "@/lib/auth";

export default function Home() {
  const loginMutation = useLogin();

  const handleLogin = async () => {
    try {
      const response = await loginMutation.mutateAsync({
        email: "whit@mail.com",
        password: "whitpass"
      });
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md w-full pt-4 px-4 overflow-y-hidden">
      <TasksCard />
      {/* TasksPage */}
      <SubjectSection />
      {/* SubjectInfoPage */}
      <NavBarGap />
      <BottomNav />
    </div>
  );
}
