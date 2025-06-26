"use client";

import NavBarGap from "@/components/nav/NavBarGap";
import BottomNav from "@/components/nav/BottomNav";
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