"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, LogOutIcon, UserIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { useLogin, useRegister } from "@/lib/auth";
import MemorializedAnimalsDialog from "@/components/MemorializedAnimalsDialog";
import NotificationSettings from "@/components/NotificationSettings";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

const STEPS_PER_MODE: Record<AuthMode, number> = {
    login: 1,
    signup: 2,
};

const STEP_TITLES: Record<AuthMode, string[]> = {
    login: ["Log In"],
    signup: ["Create Account", "Set Your Password"],
};

export default function UserModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [mode, setMode] = useState<AuthMode | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { isLoggedIn, user, login, logout } = useAuth();
    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const isPending = loginMutation.isPending || registerMutation.isPending;

    const totalSteps = mode ? STEPS_PER_MODE[mode] + 1 : 1;
    const isLastStep = mode ? step === STEPS_PER_MODE[mode] : false;

    function resetForm() {
        setEmail(""); setPassword(""); setFirstName(""); setLastName("");
    }

    function handleOpenChange(v: boolean) {
        if (!v) {
            setOpen(false);
            setTimeout(() => { setStep(0); setMode(null); resetForm(); }, 300);
        } else {
            setOpen(true);
        }
    }

    function selectMode(m: AuthMode) {
        if (m !== mode) { setPassword(""); setFirstName(""); setLastName(""); }
        setMode(m);
        setStep(1);
    }

    function goBack() {
        setStep(s => Math.max(0, s - 1));
    }

    function goNext() {
        if (mode === "signup" && step === 1) {
            if (!firstName.trim()) return;
            if (!lastName.trim()) return;
        }
        setStep(s => s + 1);
    }

    async function handleLogin() {
        try {
            const data = await loginMutation.mutateAsync({ email, password });
            if (data.token && data.user) {
                login(data.token, data.user);
                handleOpenChange(false);
            }
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    async function handleSignup() {
        try {
            await registerMutation.mutateAsync({ firstName, lastName, email, password });
            // Switch to login mode, keep email for convenience
            setMode("login");
            setStep(1);
            setPassword("");
            setFirstName("");
            setLastName("");
        } catch (err) {
            console.error("Signup failed:", err);
        }
    }

    async function handleSubmit() {
        if (mode === "login") await handleLogin();
        else if (mode === "signup") await handleSignup();
    }

    // ─── Pages ────────────────────────────────────────────────────────

    const modeSelectionPage = (
        <div className="flex flex-col gap-3 py-1">
            {(
                [
                    { id: "login" as AuthMode, label: "Log In", desc: "Welcome back — sign in to your account" },
                    { id: "signup" as AuthMode, label: "Create Account", desc: "New here? Set up your free account" },
                ] as const
            ).map(({ id, label, desc }) => (
                <button
                    key={id}
                    onClick={() => selectMode(id)}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border text-left transition-colors w-full",
                        mode === id
                            ? "bg-emerald-800 border-emerald-600"
                            : "bg-stone-600 border-stone-500 active:bg-stone-500"
                    )}
                >
                    <UserIcon className="w-6 h-6 shrink-0 text-stone-300" />
                    <div>
                        <div className="font-semibold text-stone-50">{label}</div>
                        <div className="text-sm text-stone-400">{desc}</div>
                    </div>
                </button>
            ))}
        </div>
    );

    const loginPage = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="••••••••"
                    autoComplete="current-password"
                />
            </div>
        </div>
    );

    const signupPage1 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">First Name</Label>
                <Input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Jane"
                    autoComplete="given-name"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Last Name</Label>
                <Input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Smith"
                    autoComplete="family-name"
                />
            </div>
        </div>
    );

    const signupPage2 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Email</Label>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Password</Label>
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="••••••••"
                    autoComplete="new-password"
                />
            </div>
        </div>
    );

    const modePages: Record<AuthMode, React.ReactNode[]> = {
        login: [loginPage],
        signup: [signupPage1, signupPage2],
    };

    const pages: React.ReactNode[] = [
        modeSelectionPage,
        ...(mode ? modePages[mode] : []),
    ];

    const title =
        step === 0
            ? "Welcome"
            : mode
            ? STEP_TITLES[mode][step - 1]
            : "";

    // ─── Logged-in profile view ───────────────────────────────────────

    if (isLoggedIn) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <button aria-label="User profile">
                        <UserIcon className="w-6 h-6 text-stone-500" />
                    </button>
                </DialogTrigger>
                <DialogContent
                    className="p-0 gap-0 max-w-sm w-[calc(100%-2rem)]"
                    showCloseButton={false}
                >
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 pt-5 pb-3">
                        <div className="w-7" />
                        <DialogTitle className="flex-1 text-center text-stone-50 text-base font-semibold">
                            Profile
                        </DialogTitle>
                        <button
                            onClick={() => handleOpenChange(false)}
                            className="p-1 -mr-1 rounded-md text-stone-400 hover:text-stone-50 transition-colors"
                            aria-label="Close"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Profile content */}
                    <div className="px-4 pb-4 flex flex-col gap-3">
                        <div className="bg-stone-600 rounded-xl p-4 flex flex-col gap-1">
                            <p className="text-stone-50 font-semibold">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-stone-400 text-sm">{user?.email}</p>
                        </div>

                        <MemorializedAnimalsDialog />
                        <NotificationSettings />

                        <Button
                            variant="ghost"
                            className="mt-2 w-full text-red-400 hover:text-red-300 hover:bg-stone-600 gap-2"
                            onClick={() => { logout(); handleOpenChange(false); }}
                        >
                            <LogOutIcon className="w-4 h-4" />
                            Log Out
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // ─── Auth modal (not logged in) ───────────────────────────────────

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button aria-label="Log in" className="relative">
                    <UserIcon className="w-6 h-6 text-stone-500" />
                    <UserIcon className="w-6 h-6 text-stone-500 absolute top-0 animate-ping" />
                </button>
            </DialogTrigger>
            <DialogContent
                className="p-0 gap-0 max-w-sm w-[calc(100%-2rem)]"
                showCloseButton={false}
            >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 pt-5 pb-3">
                    {step > 0 ? (
                        <button
                            onClick={goBack}
                            className="p-1 -ml-1 rounded-md text-stone-400 hover:text-stone-50 transition-colors"
                            aria-label="Go back"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-7" />
                    )}
                    <DialogTitle className="flex-1 text-center text-stone-50 text-base font-semibold">
                        {title}
                    </DialogTitle>
                    <button
                        onClick={() => handleOpenChange(false)}
                        className="p-1 -mr-1 rounded-md text-stone-400 hover:text-stone-50 transition-colors"
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Step dots */}
                {mode && (
                    <div className="flex justify-center gap-1.5 pb-3">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-full transition-all duration-300",
                                    i === step
                                        ? "w-4 h-1.5 bg-emerald-400"
                                        : "w-1.5 h-1.5 bg-stone-600"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Sliding pages */}
                <div className="overflow-x-hidden min-h-[200px]">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            width: `${totalSteps * 100}%`,
                            transform: `translateX(-${(step / totalSteps) * 100}%)`,
                        }}
                    >
                        {pages.map((page, i) => (
                            <div
                                key={i}
                                className="px-4 py-2"
                                style={{ width: `${100 / totalSteps}%` }}
                            >
                                {page}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-4 py-4">
                    {step === 0 ? (
                        <Button
                            variant="outline"
                            className="flex-1 border-stone-500 text-stone-700 hover:text-stone-50"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                    ) : isLastStep ? (
                        <>
                            <Button
                                variant="ghost"
                                className="text-stone-400 hover:text-stone-50"
                                onClick={goBack}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-stone-50"
                                onClick={handleSubmit}
                                disabled={isPending}
                            >
                                {isPending
                                    ? mode === "login" ? "Logging in..." : "Creating account..."
                                    : mode === "login" ? "Log In" : "Create Account"}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                className="text-stone-400 hover:text-stone-50"
                                onClick={goBack}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-1 bg-stone-600 hover:bg-stone-500 text-stone-50"
                                onClick={goNext}
                            >
                                Next
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
