import Link from "next/link";
import { BellIcon, HomeIcon, ListIcon, PawPrintIcon } from "lucide-react";

export const metadata = {
    title: "Brindl — Welcome",
    description: "Brindl helps you manage your animals, enclosures, and care tasks all in one place.",
};

const features = [
    {
        icon: PawPrintIcon,
        title: "Track every animal",
        desc: "Store each pet's personality, diet, routine, and history in one place — always a tap away.",
    },
    {
        icon: HomeIcon,
        title: "Organize by enclosure",
        desc: "Group animals into habitats and manage shared care routines for the whole enclosure.",
    },
    {
        icon: ListIcon,
        title: "Never miss a care task",
        desc: "Repeating tasks remind you when feeding, cleaning, or check-ups are due — and turn red when overdue.",
    },
    {
        icon: BellIcon,
        title: "Push notifications",
        desc: "Install as an app and get reminders delivered to your home screen, even when the browser is closed.",
    },
];

export default function WelcomePage() {
    return (
        <div className="flex flex-col min-h-dvh w-full px-6 pb-12">

            {/* Hero */}
            <div className="flex flex-col items-center text-center pt-20 pb-12 gap-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-800 border border-emerald-600 mb-2">
                    <PawPrintIcon className="w-10 h-10 text-emerald-300" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-stone-50">Brindl</h1>
                <p className="text-lg text-stone-300 max-w-xs leading-snug">
                    All your animals, organized.
                </p>
                <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                    Track care routines, feeding schedules, and enclosure needs for every animal in your family — on any device.
                </p>
            </div>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mb-10">
                {features.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-4 p-4 rounded-xl bg-stone-800 border border-stone-700">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-900 border border-emerald-700 shrink-0">
                            <Icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-stone-50 text-sm">{title}</p>
                            <p className="text-stone-400 text-sm leading-snug mt-0.5">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview link */}
            <Link
                href="/welcome/demo"
                className="flex items-center justify-center w-full py-3 px-6 rounded-xl border border-dashed border-stone-600 text-stone-400 hover:text-stone-200 hover:border-stone-500 transition-colors mb-2"
            >
                See what it looks like →
            </Link>

            {/* CTAs */}
            <div className="flex flex-col gap-6">
                <Link
                    href="/?signup=true"
                    className="flex items-center justify-center w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-stone-50 font-semibold transition-colors"
                >
                    Create Account
                </Link>
                <Link
                    href="/?login=true"
                    className="flex items-center justify-center w-full py-3 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-900 border border-stone-700 text-stone-300 font-medium transition-colors"
                >
                    Log In
                </Link>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-stone-600 mt-10">
                Brindl — Animal Family &copy; {new Date().getFullYear()}
            </p>
        </div>
    );
}
