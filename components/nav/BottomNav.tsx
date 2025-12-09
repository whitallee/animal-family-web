"use client";

import { HomeIcon, ListIcon, PawPrintIcon } from "lucide-react";
import UserDrawer from "@/components/nav/UserDrawer";
import AddAnythingDrawer from "@/components/nav/AddAnythingDrawer";

type View = "home" | "family" | "tasks";

interface BottomNavProps {
    activeView: View;
    onViewChange: (view: View) => void;
}

function NavButton({ view, activeView, onViewChange, children }: { view: View, activeView: View, onViewChange: (view: View) => void, children: React.ReactNode }) {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => onViewChange(view)}
            className={`${isActive ? "text-emerald-400" : "text-stone-500"} transition-colors`}
            aria-label={view}
        >
            {children}
        </button>
    );
}

export default function BottomNav({ activeView, onViewChange }: BottomNavProps) {
    return (
        <div className="w-full fixed items-center bottom-0 left-0 right-0">
        <div className=" max-w-md flex justify-between items-center h-16 px-4 mx-auto bg-stone-800 sm:rounded-full sm:px-8 sm:-translate-y-2">
            <AddAnythingDrawer />
            <NavButton view="family" activeView={activeView} onViewChange={onViewChange}>
                <PawPrintIcon className="w-6 h-6" />
            </NavButton>
            <NavButton view="home" activeView={activeView} onViewChange={onViewChange}>
                <HomeIcon className="w-6 h-6" />
            </NavButton>
            <NavButton view="tasks" activeView={activeView} onViewChange={onViewChange}>
                <ListIcon className="w-6 h-6" />
            </NavButton>
            <UserDrawer />
        </div>
        </div>
    );
}