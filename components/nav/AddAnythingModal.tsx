"use client";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckIcon,
    ChevronsUpDownIcon,
    HomeIcon,
    ListIcon,
    PawPrintIcon,
    Plus,
    XIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAnimal } from "@/lib/api/animal-mutations";
import { useHabitats, useSpecies } from "@/lib/api/fetch-species-habitats";
import { useAnimals, useEnclosures } from "@/lib/api/fetch-family";
import { Animal, Enclosure, Task } from "@/types/db-types";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateEnclosure } from "@/lib/api/enclosure-mutations";
import { useCreateTask } from "@/lib/api/task-mutations";

type WizardType = "task" | "animal" | "enclosure";

const STEPS_PER_TYPE: Record<WizardType, number> = {
    task: 2,
    animal: 4,
    enclosure: 2,
};

const STEP_TITLES: Record<WizardType, string[]> = {
    task: ["New Task", "Schedule & Assign"],
    animal: ["New Animal", "More Details", "Personality & Diet", "Routine & Notes"],
    enclosure: ["New Enclosure", "Notes"],
};

export default function AddAnythingModal() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [type, setType] = useState<WizardType | null>(null);

    const { data: species } = useSpecies();
    const { data: enclosures } = useEnclosures();
    const { data: habitats } = useHabitats();
    const { data: animals } = useAnimals();

    // Animal form state
    const [animalName, setAnimalName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [personalityDesc, setPersonalityDesc] = useState("");
    const [dietDesc, setDietDesc] = useState("");
    const [routineDesc, setRoutineDesc] = useState("");
    const [extraNotes, setExtraNotes] = useState("");
    const [openSpecies, setOpenSpecies] = useState(false);
    const [openEnclosureForAnimal, setOpenEnclosureForAnimal] = useState(false);
    const [speciesId, setSpeciesId] = useState("");
    const [animalEnclosureId, setAnimalEnclosureId] = useState("");

    // Enclosure form state
    const [enclosureName, setEnclosureName] = useState("");
    const [enclosureNotes, setEnclosureNotes] = useState("");
    const [openHabitat, setOpenHabitat] = useState(false);
    const [habitatId, setHabitatId] = useState("");

    // Task form state
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [repeatIntervUnitAmt, setRepeatIntervUnitAmt] = useState<number | "">(1);
    const [repeatIntervUnitType, setRepeatIntervUnitType] = useState("days");
    const [openAnimalInTask, setOpenAnimalInTask] = useState(false);
    const [openEnclosureInTask, setOpenEnclosureInTask] = useState(false);
    const [animalIdSubject, setAnimalIdSubject] = useState(0);
    const [enclosureIdSubject, setEnclosureIdSubject] = useState(0);

    const createAnimalMutation = useCreateAnimal();
    const createEnclosureMutation = useCreateEnclosure();
    const createTaskMutation = useCreateTask();

    const isPending =
        createAnimalMutation.isPending ||
        createEnclosureMutation.isPending ||
        createTaskMutation.isPending;

    const totalSteps = type ? STEPS_PER_TYPE[type] + 1 : 1;
    const isLastStep = type ? step === STEPS_PER_TYPE[type] : false;

    function resetForms() {
        setAnimalName(""); setGender(""); setDob("");
        setPersonalityDesc(""); setDietDesc(""); setRoutineDesc(""); setExtraNotes("");
        setSpeciesId(""); setAnimalEnclosureId("");
        setEnclosureName(""); setEnclosureNotes(""); setHabitatId("");
        setTaskName(""); setTaskDesc(""); setRepeatIntervUnitAmt(1);
        setRepeatIntervUnitType("days"); setAnimalIdSubject(0); setEnclosureIdSubject(0);
    }

    function handleOpenChange(v: boolean) {
        if (!v) {
            setOpen(false);
            setTimeout(() => { setStep(0); setType(null); resetForms(); }, 300);
        } else {
            setOpen(true);
        }
    }

    function selectType(t: WizardType) {
        if (t !== type) resetForms();
        setType(t);
        setStep(1);
    }

    function goBack() {
        setStep(s => Math.max(0, s - 1));
    }

    function validateStep(): boolean {
        if (!type) return true;
        if (type === "task") {
            if (step === 1) {
                if (!taskName.trim()) { toast.error("Task name is required"); return false; }
                if (!taskDesc.trim()) { toast.error("Notes are required"); return false; }
            }
            if (step === 2) {
                if (!repeatIntervUnitAmt || repeatIntervUnitAmt <= 0) {
                    toast.error("Repeat interval must be greater than 0"); return false;
                }
            }
        }
        if (type === "animal") {
            if (step === 1) {
                if (!animalName.trim()) { toast.error("Animal name is required"); return false; }
                if (!speciesId) { toast.error("Species is required"); return false; }
                if (!gender) { toast.error("Gender is required"); return false; }
            }
            if (step === 2) {
                if (!dob) { toast.error("Date of birth is required"); return false; }
            }
            if (step === 3) {
                if (!personalityDesc.trim()) { toast.error("Personality description is required"); return false; }
                if (!dietDesc.trim()) { toast.error("Diet description is required"); return false; }
            }
            if (step === 4) {
                if (!routineDesc.trim()) { toast.error("Routine description is required"); return false; }
            }
        }
        if (type === "enclosure") {
            if (step === 1) {
                if (!enclosureName.trim()) { toast.error("Enclosure name is required"); return false; }
                if (!habitatId) { toast.error("Habitat is required"); return false; }
            }
        }
        return true;
    }

    function goNext() {
        if (!validateStep()) return;
        setStep(s => s + 1);
    }

    async function handleSubmit() {
        if (!validateStep()) return;
        try {
            if (type === "task") {
                const unitAmt = typeof repeatIntervUnitAmt === "number" ? repeatIntervUnitAmt : 1;
                const multipliers: Record<string, number> = {
                    hours: 1, days: 24, weeks: 168, months: 720, years: 8760,
                };
                const task: Task = {
                    taskId: 0,
                    taskName: taskName.trim(),
                    taskDesc: taskDesc.trim(),
                    complete: false,
                    lastCompleted: "",
                    repeatIntervHours: unitAmt * (multipliers[repeatIntervUnitType] ?? 24),
                    animalId: animalIdSubject,
                    enclosureId: enclosureIdSubject,
                };
                await createTaskMutation.mutateAsync(task);
            } else if (type === "animal") {
                const animal: Animal = {
                    animalId: 0,
                    animalName: animalName.trim(),
                    image: "",
                    gender,
                    dob,
                    personalityDesc: personalityDesc.trim(),
                    dietDesc: dietDesc.trim(),
                    routineDesc: routineDesc.trim(),
                    extraNotes: extraNotes.trim(),
                    speciesId: parseInt(speciesId),
                    enclosureId: animalEnclosureId ? parseInt(animalEnclosureId) : 0,
                };
                await createAnimalMutation.mutateAsync(animal);
            } else if (type === "enclosure") {
                const enclosure: Enclosure = {
                    enclosureId: 0,
                    enclosureName: enclosureName.trim(),
                    image: "",
                    notes: enclosureNotes.trim(),
                    habitatId: parseInt(habitatId),
                };
                await createEnclosureMutation.mutateAsync(enclosure);
            }
            handleOpenChange(false);
        } catch (err) {
            console.error("Failed to create:", err);
            toast.error("Something went wrong. Please try again.");
        }
    }

    // ─── Page content ──────────────────────────────────────────────────

    const typeSelectionPage = (
        <div className="flex flex-col gap-3 py-1">
            {(
                [
                    { id: "task" as WizardType, label: "Task", Icon: ListIcon, desc: "Add a recurring care task" },
                    { id: "animal" as WizardType, label: "Animal", Icon: PawPrintIcon, desc: "Add a new animal to your family" },
                    { id: "enclosure" as WizardType, label: "Enclosure", Icon: HomeIcon, desc: "Add a new habitat enclosure" },
                ] as const
            ).map(({ id, label, Icon, desc }) => (
                <button
                    key={id}
                    onClick={() => selectType(id)}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border text-left transition-colors w-full",
                        type === id
                            ? "bg-emerald-800 border-emerald-600"
                            : "bg-stone-600 border-stone-500 active:bg-stone-500"
                    )}
                >
                    <Icon className="w-6 h-6 shrink-0 text-stone-300" />
                    <div>
                        <div className="font-semibold text-stone-50">{label}</div>
                        <div className="text-sm text-stone-400">{desc}</div>
                    </div>
                </button>
            ))}
        </div>
    );

    // Task pages
    const taskPage1 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Task Name</Label>
                <Input
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="e.g. Feed crickets"
                />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Notes</Label>
                <Textarea
                    value={taskDesc}
                    onChange={e => setTaskDesc(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Describe what needs to be done"
                    rows={4}
                />
            </div>
        </div>
    );

    const taskPage2 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Repeat Every</Label>
                <div className="flex gap-2 items-center">
                    <Input
                        type="number"
                        min={1}
                        value={repeatIntervUnitAmt}
                        onChange={e => setRepeatIntervUnitAmt(parseInt(e.target.value) || "")}
                        className="bg-stone-600 border-stone-500 text-stone-50 w-24"
                    />
                    <select
                        value={repeatIntervUnitType}
                        onChange={e => setRepeatIntervUnitType(e.target.value)}
                        className="bg-stone-600 border border-stone-500 text-stone-50 py-1 px-3 rounded-md h-9 flex-1"
                    >
                        <option value="hours">hours</option>
                        <option value="days">days</option>
                        <option value="weeks">weeks</option>
                        <option value="months">months</option>
                        <option value="years">years</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">
                    Assign to <span className="text-stone-400 font-normal">(optional)</span>
                </Label>
                <p className="text-xs text-stone-400 -mt-1">Choose an animal or an enclosure, not both</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-stone-400 text-xs">Animal</Label>
                        <Popover open={openAnimalInTask} onOpenChange={setOpenAnimalInTask}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox"
                                    className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal overflow-hidden">
                                    {animalIdSubject
                                        ? animals?.find((a: Animal) => a.animalId === animalIdSubject)?.animalName
                                        : "Animal"}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                <Command className="bg-stone-600">
                                    <CommandInput placeholder="Search..." />
                                    <CommandList>
                                        <ScrollArea className="h-[150px]">
                                            <CommandEmpty>None found.</CommandEmpty>
                                            <CommandGroup>
                                                {animals?.map((a: Animal) => (
                                                    <CommandItem key={`${a.animalId}-${a.animalName}`}
                                                        value={`${a.animalId}-${a.animalName}`}
                                                        className="bg-stone-600 text-stone-50"
                                                        onSelect={v => {
                                                            setAnimalIdSubject(parseInt(v.split("-")[0]));
                                                            setEnclosureIdSubject(0);
                                                            setOpenAnimalInTask(false);
                                                        }}>
                                                        <CheckIcon className={cn("mr-2 h-4 w-4",
                                                            animalIdSubject === a.animalId ? "opacity-100" : "opacity-0")} />
                                                        {a.animalName}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </ScrollArea>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-stone-400 text-xs">Enclosure</Label>
                        <Popover open={openEnclosureInTask} onOpenChange={setOpenEnclosureInTask}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox"
                                    className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal overflow-hidden">
                                    {enclosureIdSubject
                                        ? enclosures?.find((e: Enclosure) => e.enclosureId === enclosureIdSubject)?.enclosureName
                                        : "Enclosure"}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                <Command className="bg-stone-600">
                                    <CommandInput placeholder="Search..." />
                                    <CommandList>
                                        <ScrollArea className="h-[150px]">
                                            <CommandEmpty>None found.</CommandEmpty>
                                            <CommandGroup>
                                                {enclosures?.map((e: Enclosure) => (
                                                    <CommandItem key={`${e.enclosureId}-${e.enclosureName}`}
                                                        value={`${e.enclosureId}-${e.enclosureName}`}
                                                        className="bg-stone-600 text-stone-50"
                                                        onSelect={v => {
                                                            setEnclosureIdSubject(parseInt(v.split("-")[0]));
                                                            setAnimalIdSubject(0);
                                                            setOpenEnclosureInTask(false);
                                                        }}>
                                                        <CheckIcon className={cn("mr-2 h-4 w-4",
                                                            enclosureIdSubject === e.enclosureId ? "opacity-100" : "opacity-0")} />
                                                        {e.enclosureName}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </ScrollArea>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    );

    // Animal pages
    const animalPage1 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Name</Label>
                <Input value={animalName} onChange={e => setAnimalName(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50" placeholder="e.g. Charlie" />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Species</Label>
                <Popover open={openSpecies} onOpenChange={setOpenSpecies}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox"
                            className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal overflow-hidden">
                            {speciesId
                                ? species?.find(s => s.speciesId.toString() === speciesId)?.comName
                                : "Select species"}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-stone-600 border-stone-500 text-stone-50">
                        <Command className="bg-stone-600">
                            <CommandInput placeholder="Search species..." />
                            <CommandList>
                                <ScrollArea className="h-[150px]">
                                    <CommandEmpty>No species found.</CommandEmpty>
                                    <CommandGroup>
                                        {species?.map(s => (
                                            <CommandItem
                                                key={`${s.speciesId}-${s.comName}-${s.sciName}`}
                                                value={`${s.speciesId}-${s.comName}-${s.sciName}-${s.speciesDesc}`}
                                                className="bg-stone-600 text-stone-50"
                                                onSelect={v => { setSpeciesId(v.split("-")[0]); setOpenSpecies(false); }}>
                                                <CheckIcon className={cn("mr-2 h-4 w-4",
                                                    speciesId === s.speciesId.toString() ? "opacity-100" : "opacity-0")} />
                                                {s.comName}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Gender</Label>
                <div className="flex gap-2">
                    {["Male", "Female", "Unknown"].map(g => (
                        <button key={g} type="button" onClick={() => setGender(g)}
                            className={cn(
                                "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors",
                                gender === g
                                    ? "bg-emerald-800 border-emerald-600 text-stone-50"
                                    : "bg-stone-600 border-stone-500 text-stone-300"
                            )}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const animalPage2 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Date of Birth</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline"
                            className="w-full justify-between font-normal bg-stone-600 border-stone-500 text-stone-50">
                            {dob ? format(dob, "PPP") : "Select date"}
                            <CalendarIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0 bg-stone-600 border-stone-500 text-stone-50 min-h-[336px]" align="start">
                        <Calendar mode="single" selected={dob ? new Date(dob) : undefined}
                            captionLayout="dropdown"
                            onSelect={date => { setDob(date?.toISOString() || ""); setCalendarOpen(false); }} />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">
                    Enclosure <span className="text-stone-400 font-normal">(optional)</span>
                </Label>
                <Popover open={openEnclosureForAnimal} onOpenChange={setOpenEnclosureForAnimal}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox"
                            className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal overflow-hidden">
                            {animalEnclosureId
                                ? enclosures?.find((e: Enclosure) => e.enclosureId.toString() === animalEnclosureId)?.enclosureName
                                : "Select enclosure"}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-stone-600 border-stone-500 text-stone-50">
                        <Command className="bg-stone-600">
                            <CommandInput placeholder="Search enclosures..." />
                            <CommandList>
                                <ScrollArea className="h-[150px]">
                                    <CommandEmpty>No enclosures found.</CommandEmpty>
                                    <CommandGroup>
                                        {enclosures?.map((e: Enclosure) => (
                                            <CommandItem key={`${e.enclosureId}-${e.enclosureName}`}
                                                value={`${e.enclosureId}-${e.enclosureName}`}
                                                className="bg-stone-600 text-stone-50"
                                                onSelect={v => { setAnimalEnclosureId(v.split("-")[0]); setOpenEnclosureForAnimal(false); }}>
                                                <CheckIcon className={cn("mr-2 h-4 w-4",
                                                    animalEnclosureId === e.enclosureId.toString() ? "opacity-100" : "opacity-0")} />
                                                {e.enclosureName}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );

    const animalPage3 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Personality</Label>
                <Textarea value={personalityDesc} onChange={e => setPersonalityDesc(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Describe their personality..." rows={3} />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Diet</Label>
                <Textarea value={dietDesc} onChange={e => setDietDesc(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="What and how often do they eat?" rows={3} />
            </div>
        </div>
    );

    const animalPage4 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Routine</Label>
                <Textarea value={routineDesc} onChange={e => setRoutineDesc(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Daily care routine..." rows={3} />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">
                    Extra Notes <span className="text-stone-400 font-normal">(optional)</span>
                </Label>
                <Textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Anything else to note..." rows={3} />
            </div>
        </div>
    );

    // Enclosure pages
    const enclosurePage1 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">Enclosure Name</Label>
                <Input value={enclosureName} onChange={e => setEnclosureName(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50" placeholder="e.g. Bedroom Fish Tank" />
            </div>
            <div className="space-y-2">
                <Label className="text-stone-50">Habitat Type</Label>
                <Popover open={openHabitat} onOpenChange={setOpenHabitat}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox"
                            className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal overflow-hidden">
                            {habitatId
                                ? habitats?.find(h => h.habitatId.toString() === habitatId)?.habitatName
                                : "Select habitat"}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-stone-600 border-stone-500 text-stone-50">
                        <Command className="bg-stone-600">
                            <CommandInput placeholder="Search habitats..." />
                            <CommandList>
                                <ScrollArea className="h-[150px]">
                                    <CommandEmpty>No habitats found.</CommandEmpty>
                                    <CommandGroup>
                                        {habitats?.map(h => (
                                            <CommandItem
                                                key={`${h.habitatId}-${h.habitatName}-${h.habitatDesc}`}
                                                value={`${h.habitatId}-${h.habitatName}-${h.habitatDesc}`}
                                                className="bg-stone-600 text-stone-50"
                                                onSelect={v => { setHabitatId(v.split("-")[0]); setOpenHabitat(false); }}>
                                                <CheckIcon className={cn("mr-2 h-4 w-4",
                                                    habitatId === h.habitatId.toString() ? "opacity-100" : "opacity-0")} />
                                                {h.habitatName}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );

    const enclosurePage2 = (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label className="text-stone-50">
                    Notes <span className="text-stone-400 font-normal">(optional)</span>
                </Label>
                <Textarea value={enclosureNotes} onChange={e => setEnclosureNotes(e.target.value)}
                    className="bg-stone-600 border-stone-500 text-stone-50"
                    placeholder="Setup details, maintenance notes..." rows={5} />
            </div>
        </div>
    );

    const typePages: Record<WizardType, React.ReactNode[]> = {
        task: [taskPage1, taskPage2],
        animal: [animalPage1, animalPage2, animalPage3, animalPage4],
        enclosure: [enclosurePage1, enclosurePage2],
    };

    const pages: React.ReactNode[] = [
        typeSelectionPage,
        ...(type ? typePages[type] : []),
    ];

    const title =
        step === 0
            ? "What would you like to add?"
            : type
            ? STEP_TITLES[type][step - 1]
            : "";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button aria-label="Add new">
                    <Plus className="w-6 h-6 text-stone-500" />
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
                {type && (
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
                <div className="overflow-x-hidden min-h-[300px]">
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
                            <Button variant="ghost" className="text-stone-400 hover:text-stone-50" onClick={goBack}>
                                Back
                            </Button>
                            <Button
                                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-stone-50"
                                onClick={handleSubmit}
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Adding..."
                                    : `Add ${type === "task" ? "Task" : type === "animal" ? "Animal" : "Enclosure"}`}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" className="text-stone-400 hover:text-stone-50" onClick={goBack}>
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
