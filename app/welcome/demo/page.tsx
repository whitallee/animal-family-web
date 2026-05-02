"use client";

import Link from "next/link";
import { ArrowLeftIcon, HomeIcon, ListIcon, PawPrintIcon, PlusIcon, UserIcon } from "lucide-react";
import SubjectSection from "@/components/SubjectSection";
import TasksCard from "@/components/TasksCard";
import { Animal, Enclosure, Habitat, Species, Task } from "@/types/db-types";

const R = "https://raw.githubusercontent.com/whitallee/brindle-assets/main";

// ─── Static demo data ──────────────────────────────────────────────────────────

const habitats: Habitat[] = [
    { habitatId: 1, habitatName: "Aquatic",             habitatDesc: "", image: `${R}/habitats/aquatic.png`,             humidity: "", dayTempRange: "", nightTempRange: "" },
    { habitatId: 2, habitatName: "Indoor",              habitatDesc: "", image: `${R}/habitats/indoor.png`,              humidity: "", dayTempRange: "", nightTempRange: "" },
    { habitatId: 3, habitatName: "Semi-Arid",           habitatDesc: "", image: `${R}/habitats/semi-arid.png`,           humidity: "", dayTempRange: "", nightTempRange: "" },
    { habitatId: 4, habitatName: "Tropical Rain Forest",habitatDesc: "", image: `${R}/habitats/tropical-rain-forest.png`,humidity: "", dayTempRange: "", nightTempRange: "" },
];

const species: Species[] = [
    { speciesId: 1, comName: "African Fat-Tailed Gecko",             sciName: "", image: `${R}/species/african-fat-tailed-gecko.png`, speciesDesc: "", habitatId: 3, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
    { speciesId: 2, comName: "Ball Python",                          sciName: "", image: `${R}/species/ball-python.png`,              speciesDesc: "", habitatId: 4, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
    { speciesId: 3, comName: "Chinchilla",                           sciName: "", image: `${R}/species/chinchilla.png`,               speciesDesc: "", habitatId: 2, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
    { speciesId: 4, comName: "Veiled Chameleon",                     sciName: "", image: `${R}/species/veiled-chameleon.png`,         speciesDesc: "", habitatId: 4, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
    { speciesId: 5, comName: "Blue Tiger Polar Parrot Cichlid",      sciName: "", image: `${R}/species/blue-tiger-polar-parrot-cichlid.png`, speciesDesc: "", habitatId: 1, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
    { speciesId: 6, comName: "Plecostomus",                          sciName: "", image: `${R}/species/plecostomus.png`,              speciesDesc: "", habitatId: 1, baskTemp: "", diet: "", sociality: "", lifespan: "", size: "", weight: "", conservationStatus: "", extraCare: "" },
];

const enclosures: Enclosure[] = [
    { enclosureId: 1, enclosureName: "Coral Reef Tank", image: "", notes: "", habitatId: 1 },
    { enclosureId: 2, enclosureName: "Floof Palace",    image: "", notes: "", habitatId: 2 },
    { enclosureId: 3, enclosureName: "Pepper's Tank",   image: "", notes: "", habitatId: 4 },
    { enclosureId: 4, enclosureName: "Zara's Tank",     image: "", notes: "", habitatId: 4 },
    { enclosureId: 5, enclosureName: "Cleo's Tank",     image: "", notes: "", habitatId: 3 },
];

const animals: Animal[] = [
    { animalId: 1, animalName: "Rio",    image: "", gender: "Male",   dob: "2023-01-01", speciesId: 5, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 2, animalName: "Marina", image: "", gender: "Female", dob: "2023-01-01", speciesId: 5, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 3, animalName: "Clyde",  image: "", gender: "Male",   dob: "2022-06-01", speciesId: 6, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 4, animalName: "Luna",   image: "", gender: "Female", dob: "2022-03-15", speciesId: 3, enclosureId: 2, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 5, animalName: "Nova",   image: "", gender: "Female", dob: "2022-03-15", speciesId: 3, enclosureId: 2, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 6, animalName: "Pepper", image: "", gender: "Female", dob: "2021-08-20", speciesId: 2, enclosureId: 3, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 7, animalName: "Zara",   image: "", gender: "Female", dob: "2023-05-10", speciesId: 4, enclosureId: 4, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 8, animalName: "Cleo",   image: "", gender: "Female", dob: "2022-11-30", speciesId: 1, enclosureId: 5, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
];

// Compute relative timestamps so the demo always looks right
const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

const tasks: Task[] = [
    // Overdue: last fed 3 days ago on a daily schedule → 48h past due
    { taskId: 1, taskName: "Feed cichlids",              taskDesc: "", complete: false, lastCompleted: ago(72),  repeatIntervHours: 24,  enclosureId: 1 },
    // Upcoming: filter cleaned yesterday, next due in ~6 days
    { taskId: 2, taskName: "Clean tank filter",          taskDesc: "", complete: false, lastCompleted: ago(24),  repeatIntervHours: 168, enclosureId: 1 },
    // Due but not yet overdue: dust bath due ~12h ago
    { taskId: 3, taskName: "Give chinchillas dust bath", taskDesc: "", complete: false, lastCompleted: ago(180), repeatIntervHours: 168, enclosureId: 2 },
    // Complete: fed an hour ago
    { taskId: 4, taskName: "Feed Pepper",                taskDesc: "", complete: true,  lastCompleted: ago(1),   repeatIntervHours: 48,  animalId: 6 },
    // Due but not yet overdue: misted ~14h ago on a daily schedule
    { taskId: 5, taskName: "Mist Zara's enclosure",      taskDesc: "", complete: false, lastCompleted: ago(38),  repeatIntervHours: 24,  enclosureId: 4 },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DemoPage() {
    return (
        <div className="flex flex-col w-full min-h-dvh">

            {/* Top bar */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-3 w-full max-w-screen-lg mx-auto">
                <Link
                    href="/welcome"
                    className="flex items-center gap-1.5 text-stone-400 hover:text-stone-50 transition-colors text-sm"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back
                </Link>
                <div className="flex-1" />
                <span className="text-xs text-stone-500 bg-stone-800 border border-stone-700 rounded-full px-3 py-1">
                    Preview
                </span>
            </div>

            {/* ── Mobile layout ─────────────────────────────────────────────── */}
            {/* Single-column, fixed bottom overlay — identical to before       */}
            <div className="md:hidden w-full pt-2 px-4 pb-36">
                <TasksCard tasks={tasks} isPending={false} />
                <SubjectSection
                    tasks={tasks}
                    enclosures={enclosures}
                    animals={animals}
                    habitats={habitats}
                    species={species}
                    isPending={false}
                />
            </div>

            {/* Mobile: fixed bottom nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 pointer-events-none">
                <div className="max-w-screen-sm mx-auto">
                    <div className="max-w-md flex justify-between items-center h-16 px-8 py-2 mx-auto bg-stone-800 sm:rounded-full sm:px-8 sm:-translate-y-2 opacity-80">
                        <PlusIcon className="w-6 h-6 text-stone-600" />
                        <PawPrintIcon className="w-6 h-6 text-stone-500" />
                        <HomeIcon className="w-6 h-6 text-emerald-400" />
                        <ListIcon className="w-6 h-6 text-stone-500" />
                        <UserIcon className="w-6 h-6 text-stone-500" />
                    </div>
                </div>
            </div>

            {/* Mobile: floating CTA */}
            <div className="md:hidden fixed bottom-20 left-0 right-0 px-6 max-w-screen-sm mx-auto">
                <div className="flex gap-2">
                    <Link
                        href="/?signup=true"
                        className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-stone-50 font-semibold text-sm transition-colors shadow-lg"
                    >
                        Create Account
                    </Link>
                    <Link
                        href="/?login=true"
                        className="flex-1 flex items-center justify-center py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-medium text-sm transition-colors shadow-lg"
                    >
                        Log In
                    </Link>
                </div>
            </div>

            {/* ── Desktop layout ────────────────────────────────────────────── */}
            {/* Two columns: phone mockup on left, marketing + CTAs on right    */}
            <div className="hidden md:flex flex-1 items-center gap-16 w-full max-w-screen-lg mx-auto px-12 py-8">

                {/* Phone mockup */}
                <div className="relative w-[320px] h-[640px] flex-shrink-0 bg-stone-950 rounded-[2rem] border-2 border-stone-700 shadow-2xl overflow-hidden">

                    {/* Scrollable app content */}
                    <div className="w-full h-[572px] overflow-y-auto scrollbar-hide pt-4 px-4">
                        <TasksCard tasks={tasks} isPending={false} className="scrollbar-hide" />
                        <SubjectSection
                            tasks={tasks}
                            enclosures={enclosures}
                            animals={animals}
                            habitats={habitats}
                            species={species}
                            isPending={false}
                            className="scrollbar-hide"
                        />
                    </div>

                    {/* Bottom nav pinned inside mockup */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center h-[68px] px-8 bg-stone-800 opacity-90">
                        <PlusIcon className="w-6 h-6 text-stone-600" />
                        <PawPrintIcon className="w-6 h-6 text-stone-500" />
                        <HomeIcon className="w-6 h-6 text-emerald-400" />
                        <ListIcon className="w-6 h-6 text-stone-500" />
                        <UserIcon className="w-6 h-6 text-stone-500" />
                    </div>
                </div>

                {/* Marketing + CTAs */}
                <div className="flex flex-col gap-6 flex-1 max-w-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800 border border-emerald-600 shrink-0">
                            <PawPrintIcon className="w-7 h-7 text-emerald-300" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-stone-50">Brindl</h1>
                    </div>
                    <p className="text-2xl text-stone-200 leading-snug font-medium">
                        All your animals, organized.
                    </p>
                    <p className="text-stone-400 leading-relaxed">
                        Track care routines, feeding schedules, and enclosure needs for every animal in your family — on any device.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                        <Link
                            href="/?signup=true"
                            className="flex items-center justify-center py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-stone-50 font-semibold transition-colors shadow-lg"
                        >
                            Create Account
                        </Link>
                        <Link
                            href="/?login=true"
                            className="flex items-center justify-center py-3 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-medium transition-colors shadow-lg"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}
