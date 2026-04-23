"use client";

import Link from "next/link";
import { ArrowLeftIcon, HomeIcon, ListIcon, PawPrintIcon, UserIcon } from "lucide-react";
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

// All animals live inside enclosures — solo ones get their own enclosure
const enclosures: Enclosure[] = [
    { enclosureId: 1, enclosureName: "Coral Reef Tank", image: "", notes: "", habitatId: 1 }, // aquatic
    { enclosureId: 2, enclosureName: "Floof Palace",    image: "", notes: "", habitatId: 2 }, // indoor
    { enclosureId: 3, enclosureName: "Pepper's Tank",   image: "", notes: "", habitatId: 4 }, // tropical
    { enclosureId: 4, enclosureName: "Zara's Tank",     image: "", notes: "", habitatId: 4 }, // tropical
    { enclosureId: 5, enclosureName: "Cleo's Tank",     image: "", notes: "", habitatId: 3 }, // semi-arid
];

const animals: Animal[] = [
    // Coral Reef Tank — cichlids + pleco
    { animalId: 1, animalName: "Rio",    image: "", gender: "Male",   dob: "2023-01-01", speciesId: 5, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 2, animalName: "Marina", image: "", gender: "Female", dob: "2023-01-01", speciesId: 5, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 3, animalName: "Clyde",  image: "", gender: "Male",   dob: "2022-06-01", speciesId: 6, enclosureId: 1, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    // Floof Palace — chinchillas
    { animalId: 4, animalName: "Luna",   image: "", gender: "Female", dob: "2022-03-15", speciesId: 3, enclosureId: 2, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 5, animalName: "Nova",   image: "", gender: "Female", dob: "2022-03-15", speciesId: 3, enclosureId: 2, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    // Solo animals in their own enclosures
    { animalId: 6, animalName: "Pepper", image: "", gender: "Female", dob: "2021-08-20", speciesId: 2, enclosureId: 3, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 7, animalName: "Zara",   image: "", gender: "Female", dob: "2023-05-10", speciesId: 4, enclosureId: 4, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
    { animalId: 8, animalName: "Cleo",   image: "", gender: "Female", dob: "2022-11-30", speciesId: 1, enclosureId: 5, personalityDesc: "", dietDesc: "", routineDesc: "", extraNotes: "" },
];

// Overdue: last done 4 days ago with a 24h repeat → ~72h overdue
// Pending: last done yesterday with a weekly repeat → not yet due
// Complete: done today
const tasks: Task[] = [
    { taskId: 1, taskName: "Feed cichlids",          taskDesc: "", complete: false, lastCompleted: "2026-04-19T00:00:00.000Z", repeatIntervHours: 24,  enclosureId: 1 },
    { taskId: 2, taskName: "Clean tank filter",      taskDesc: "", complete: false, lastCompleted: "2026-04-19T00:00:00.000Z", repeatIntervHours: 24,  enclosureId: 1 },
    { taskId: 3, taskName: "Gice chinchillas dust bath",       taskDesc: "", complete: false, lastCompleted: "2026-04-22T00:00:00.000Z", repeatIntervHours: 168, enclosureId: 2 },
    { taskId: 4, taskName: "Feed Pepper",            taskDesc: "", complete: true,  lastCompleted: "2026-04-23T06:00:00.000Z", repeatIntervHours: 48,  animalId: 6 },
    { taskId: 5, taskName: "Mist Zara's enclosure",  taskDesc: "", complete: false, lastCompleted: "2026-04-22T00:00:00.000Z", repeatIntervHours: 24,  enclosureId: 4 },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DemoPage() {
    return (
        <div className="flex flex-col w-full min-h-dvh pb-36">

            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 pt-5 pb-3">
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

            {/* App content — same layout as page.tsx Home view */}
            <div className="w-full pt-2 px-4">
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

            {/* Mock bottom nav */}
            <div className="fixed bottom-0 left-0 right-0 pointer-events-none">
                <div className="max-w-screen-sm mx-auto">
                    <div className="max-w-md flex justify-between items-center h-16 px-8 py-2 mx-auto bg-stone-800 sm:rounded-full sm:px-8 sm:-translate-y-2 opacity-80">
                        <PawPrintIcon className="w-6 h-6 text-stone-600" />
                        <PawPrintIcon className="w-6 h-6 text-stone-500" />
                        <HomeIcon className="w-6 h-6 text-emerald-400" />
                        <ListIcon className="w-6 h-6 text-stone-500" />
                        <UserIcon className="w-6 h-6 text-stone-500" />
                    </div>
                </div>
            </div>

            {/* Floating CTA */}
            <div className="fixed bottom-20 left-0 right-0 px-6 max-w-screen-sm mx-auto">
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

        </div>
    );
}
