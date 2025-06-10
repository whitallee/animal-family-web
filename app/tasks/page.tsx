"use client";

import NavBarGap from "@/components/NavBarGap";
import BottomNav from "@/components/BottomNav";
import TasksPage from "@/components/TasksPage";

export default function Tasks() {

    return (
        <>
            <TasksPage />
            <NavBarGap />
            <BottomNav />
        </>
    );
}