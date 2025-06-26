"use client";

import BottomNav from "@/components/nav/BottomNav";
import NavBarGap from "@/components/nav/NavBarGap";
import FamilyPage from "@/components/FamilyPage";

export default function Family() {
    return (
        <>
            <FamilyPage />
            <NavBarGap />
            <BottomNav />
        </>
    );
}