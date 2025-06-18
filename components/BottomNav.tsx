"use client";

import { HomeIcon, ListIcon, PawPrintIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserDrawer from "@/components/UserDrawer";
import AddAnythingDrawer from "@/components/AddAnythingDrawer";

function NavPathItem({ href, children }: { href: string, children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={`${isActive ? "text-emerald-400" : "text-stone-500"}`}>{children}</Link>
    );
}

export default function BottomNav() {
    return (
        <div className="w-full fixed items-center bottom-0 left-0 right-0">
        <div className=" max-w-md flex justify-between items-center h-16 px-4 mx-auto bg-stone-800 sm:rounded-full sm:px-8 sm:-translate-y-2">
            <AddAnythingDrawer />
            <NavPathItem href="/family">
                <PawPrintIcon className="w-6 h-6" />
            </NavPathItem>
            <NavPathItem href="/">
                <HomeIcon className="w-6 h-6" />
            </NavPathItem>
            <NavPathItem href="/tasks">
                <ListIcon className="w-6 h-6" />
            </NavPathItem>
            <UserDrawer />
        </div>
        </div>
    );
}