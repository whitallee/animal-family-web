"use client";

import { HomeIcon, ListIcon, PawPrintIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, children }: { href: string, children: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={`${isActive ? "text-emerald-400" : "text-stone-500"}`}>{children}</Link>
    );
}

export default function BottomNav() {
    return (
        <div className="w-full fixed items-center bottom-0 left-0 right-0 bg-stone-800">
        <div className=" max-w-md flex justify-between items-center h-16 px-4 mx-auto">
            <NavItem href="/">
                <HomeIcon className="w-6 h-6" />
            </NavItem>
            <NavItem href="/animal-family">
                <PawPrintIcon className="w-6 h-6" />
            </NavItem>
            <NavItem href="/tasks">
                <ListIcon className="w-6 h-6" />
            </NavItem>
            <NavItem href="/user">
                <UserIcon className="w-6 h-6" />
            </NavItem>
        </div>
        </div>
    );
}