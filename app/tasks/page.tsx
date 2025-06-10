"use client";

import NavBarGap from "@/components/NavBarGap";
import BottomNav from "@/components/BottomNav";
// import TasksCard from "@/components/TasksCard";
// import { useTasks } from "@/lib/api/fetch-family";
import TasksPage from "@/components/TasksPage";
import { unstable_ViewTransition as ViewTransition } from 'react'

export default function Tasks() {
    // const { data: tasks, isPending: tasksPending } = useTasks();

    return (
        <>
            <TasksPage />
            <NavBarGap />
            <BottomNav />
        </>
    );
}