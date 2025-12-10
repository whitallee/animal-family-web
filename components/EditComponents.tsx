"use client"

import { useState } from "react";
import { PencilIcon, TrashIcon, Calendar as CalendarIcon, ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Task, Animal, Enclosure } from "@/types/db-types";
import { useUpdateTask } from "@/lib/api/task-mutations";
import { useUpdateAnimal } from "@/lib/api/animal-mutations";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
import { useEnclosures } from "@/lib/api/fetch-family";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface EditTaskButtonProps {
    task: Task;
}

// Helper function to convert hours to the best unit representation
function convertHoursToUnit(hours: number): { amount: number; unit: string } {
    if (hours % (24 * 365) === 0) {
        return { amount: hours / (24 * 365), unit: "years" };
    } else if (hours % (24 * 30) === 0) {
        return { amount: hours / (24 * 30), unit: "months" };
    } else if (hours % (24 * 7) === 0) {
        return { amount: hours / (24 * 7), unit: "weeks" };
    } else if (hours % 24 === 0) {
        return { amount: hours / 24, unit: "days" };
    } else {
        return { amount: hours, unit: "hours" };
    }
}

export function EditTaskButton({ task }: EditTaskButtonProps) {
    const initialUnit = convertHoursToUnit(task.repeatIntervHours);
    const [open, setOpen] = useState(false);
    const [taskName, setTaskName] = useState(task.taskName);
    const [taskDesc, setTaskDesc] = useState(task.taskDesc);
    const [repeatIntervUnitAmt, setRepeatIntervUnitAmt] = useState(initialUnit.amount);
    const [repeatIntervUnitType, setRepeatIntervUnitType] = useState(initialUnit.unit);
    const [complete, setComplete] = useState(task.complete);
    const [lastCompleted, setLastCompleted] = useState(task.lastCompleted || "");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const updateTask = useUpdateTask();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset form fields when dialog opens
            const unit = convertHoursToUnit(task.repeatIntervHours);
            setTaskName(task.taskName);
            setTaskDesc(task.taskDesc);
            setRepeatIntervUnitAmt(unit.amount);
            setRepeatIntervUnitType(unit.unit);
            setComplete(task.complete);
            setLastCompleted(task.lastCompleted || "");
        }
    };

    const handleSave = () => {
        // Validate required fields
        const invalidFields: string[] = [];
        
        if (!taskName.trim()) {
            invalidFields.push("Task Name");
        }
        if (!taskDesc.trim()) {
            invalidFields.push("Description");
        }
        if (!repeatIntervUnitAmt || repeatIntervUnitAmt <= 0) {
            invalidFields.push("Repeat Interval");
        }

        if (invalidFields.length > 0) {
            toast.error(`Please fill in the following fields: ${invalidFields.join(", ")}`);
            return;
        }

        // Convert unit and amount to hours
        let repeatIntervHours = 0;
        if (repeatIntervUnitType === "hours") {
            repeatIntervHours = repeatIntervUnitAmt;
        } else if (repeatIntervUnitType === "days") {
            repeatIntervHours = repeatIntervUnitAmt * 24;
        } else if (repeatIntervUnitType === "weeks") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 7;
        } else if (repeatIntervUnitType === "months") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 30;
        } else if (repeatIntervUnitType === "years") {
            repeatIntervHours = repeatIntervUnitAmt * 24 * 365;
        }

        updateTask.mutate({
            taskId: task.taskId,
            taskName: taskName.trim(),
            taskDesc: taskDesc.trim(),
            complete,
            lastCompleted: lastCompleted,
            repeatIntervHours: repeatIntervHours
        }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <>
            <Button className="flex-1" onClick={() => setOpen(true)}>
                <PencilIcon />
                Edit Task
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                            Update the task details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="taskName">Task Name</Label>
                            <Input
                                id="taskName"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="taskDesc">Description</Label>
                            <Textarea
                                id="taskDesc"
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="repeatIntervHours">Repeat Interval</Label>
                            <div className="flex flex-row gap-2 items-start">
                                <div className="flex text-stone-400 text-center items-center h-full">Every</div>
                                <Input
                                    id="repeatIntervHours"
                                    type="number"
                                    min={1}
                                    value={repeatIntervUnitAmt}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatIntervUnitAmt(parseInt(e.target.value) || 0)}
                                    className="w-[5ch] text-right"
                                    required
                                />
                                <select 
                                    id="repeatIntervUnitType"
                                    value={repeatIntervUnitType}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRepeatIntervUnitType(e.target.value)}
                                    className="bg-stone-700 border border-input rounded-md px-3 py-1 h-9"
                                >
                                    <option value="hours">hours</option>
                                    <option value="days">days</option>
                                    <option value="weeks">weeks</option>
                                    <option value="months">months</option>
                                    <option value="years">years</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lastCompleted">Last Completed</Label>
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="lastCompleted"
                                        className="w-full justify-between font-normal bg-stone-600 border-stone-500 text-stone-50 overflow-hidden"
                                    >
                                        {lastCompleted ? format(new Date(lastCompleted), "PPP") : "Select date"}
                                        <CalendarIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0 bg-stone-600 border-stone-500 text-stone-50 min-h-[336px]" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={lastCompleted ? new Date(lastCompleted) : undefined}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setLastCompleted(date?.toISOString() || "")
                                            setCalendarOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                id="complete"
                                checked={complete}
                                onChange={(e) => setComplete(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="complete">Complete</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="text-stone-800" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={updateTask.isPending}
                        >
                            {updateTask.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


interface EditAnimalButtonProps {
    animal: Animal;
}

export function EditAnimalButton({ animal }: EditAnimalButtonProps) {
    const [open, setOpen] = useState(false);
    const [animalName, setAnimalName] = useState(animal.animalName);
    const [animalImage, setAnimalImage] = useState(animal.image);
    const [gender, setGender] = useState(animal.gender);
    const [dob, setDob] = useState(animal.dob);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [personalityDesc, setPersonalityDesc] = useState(animal.personalityDesc);
    const [dietDesc, setDietDesc] = useState(animal.dietDesc);
    const [routineDesc, setRoutineDesc] = useState(animal.routineDesc);
    const [extraNotes, setExtraNotes] = useState(animal.extraNotes);
    const [openSpecies, setOpenSpecies] = useState(false);
    const [openEnclosure, setOpenEnclosure] = useState(false);
    const [speciesId, setSpeciesId] = useState(animal.speciesId.toString());
    const [enclosureId, setEnclosureId] = useState(animal.enclosureId?.toString() || "");
    const updateAnimal = useUpdateAnimal();
    const { data: species } = useSpecies();
    const { data: enclosures } = useEnclosures();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            // Reset form fields when dialog opens
            setAnimalName(animal.animalName);
            setAnimalImage(animal.image);
            setGender(animal.gender);
            setDob(animal.dob);
            setPersonalityDesc(animal.personalityDesc);
            setDietDesc(animal.dietDesc);
            setRoutineDesc(animal.routineDesc);
            setExtraNotes(animal.extraNotes);
            setSpeciesId(animal.speciesId.toString());
            setEnclosureId(animal.enclosureId?.toString() || "");
        }
    };

    const handleSave = () => {
        // Validate required fields
        const invalidFields: string[] = [];
        
        if (!animalName.trim()) {
            invalidFields.push("Animal Name");
        }
        if (!gender.trim()) {
            invalidFields.push("Gender");
        }
        if (!dob) {
            invalidFields.push("Date of Birth");
        }
        if (!personalityDesc.trim()) {
            invalidFields.push("Personality Description");
        }
        if (!dietDesc.trim()) {
            invalidFields.push("Diet Description");
        }
        if (!routineDesc.trim()) {
            invalidFields.push("Routine Description");
        }
        if (!extraNotes.trim()) {
            invalidFields.push("Extra Notes");
        }
        if (!speciesId) {
            invalidFields.push("Species");
        }

        if (invalidFields.length > 0) {
            toast.error(`Please fill in the following fields: ${invalidFields.join(", ")}`);
            return;
        }

        updateAnimal.mutate({
            animalId: animal.animalId,
            animalName: animalName.trim(),
            speciesId: parseInt(speciesId),
            enclosureId: enclosureId ? parseInt(enclosureId) : null,
            image: animalImage.trim(),
            gender: gender.trim(),
            dob: dob,
            personalityDesc: personalityDesc.trim(),
            dietDesc: dietDesc.trim(),
            routineDesc: routineDesc.trim(),
            extraNotes: extraNotes.trim()
        }, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <>
            <Button className="flex-1" onClick={() => setOpen(true)}>
                <PencilIcon />
                Edit Animal
            </Button>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Animal</DialogTitle>
                        <DialogDescription>
                            Update the animal details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="animalName">Animal Name</Label>
                            <Input
                                id="animalName"
                                value={animalName}
                                onChange={(e) => setAnimalName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="animalImage">Image URL</Label>
                            <Input
                                disabled
                                id="animalImage"
                                value={animalImage}
                                onChange={(e) => setAnimalImage(e.target.value)}
                                placeholder="Enter image URL - currently unavailable"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    placeholder="Male/Female/Unknown"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="dob"
                                            className="w-full justify-between font-normal bg-stone-600 border-stone-500 text-stone-50 overflow-hidden"
                                        >
                                            {dob ? format(new Date(dob), "PPP") : "Select date"}
                                            <CalendarIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0 bg-stone-600 border-stone-500 text-stone-50 min-h-[336px]" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dob ? new Date(dob) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDob(date?.toISOString() || "")
                                                setCalendarOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="speciesId">Species</Label>
                                <Popover open={openSpecies} onOpenChange={setOpenSpecies}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openSpecies}
                                            className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal text-md overflow-hidden"
                                        >
                                            {speciesId
                                                ? species?.find((s) => s.speciesId.toString() === speciesId)?.comName
                                                : "Select species"}
                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                        <Command className="bg-stone-600 border-stone-500 text-stone-50">
                                            <CommandInput placeholder="Search species..." />
                                            <CommandList>
                                                <ScrollArea className="h-[150px]">
                                                    <CommandEmpty>No species found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {species?.map((s) => (
                                                            <CommandItem
                                                                className="bg-stone-600 border-stone-500 text-stone-50"
                                                                key={`${s.speciesId}-${s.comName}-${s.sciName}-${s.speciesDesc}`}
                                                                value={`${s.speciesId}-${s.comName}-${s.sciName}-${s.speciesDesc}`}
                                                                onSelect={(currentValue) => {
                                                                    setSpeciesId(currentValue.split("-")[0])
                                                                    setOpenSpecies(false)
                                                                }}
                                                            >
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        speciesId === s.speciesId.toString() ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
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
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="enclosureId">Enclosure</Label>
                                <Popover open={openEnclosure} onOpenChange={setOpenEnclosure}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openEnclosure}
                                            className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal text-md overflow-hidden"
                                        >
                                            {enclosureId
                                                ? enclosures?.find((e: Enclosure) => e.enclosureId.toString() === enclosureId)?.enclosureName
                                                : "Select enclosure"}
                                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                        <Command className="bg-stone-600 border-stone-500 text-stone-50">
                                            <CommandInput placeholder="Search enclosures..." />
                                            <CommandList>
                                                <ScrollArea className="h-[150px]">
                                                    <CommandEmpty>No enclosures found.</CommandEmpty>
                                                    <CommandGroup>
                                                        <CommandItem
                                                            className="bg-stone-600 border-stone-500 text-stone-50"
                                                            onSelect={() => {
                                                                setEnclosureId("")
                                                                setOpenEnclosure(false)
                                                            }}
                                                        >
                                                            <CheckIcon
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    !enclosureId ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            None
                                                        </CommandItem>
                                                        {enclosures?.map((e: Enclosure) => (
                                                            <CommandItem
                                                                className="bg-stone-600 border-stone-500 text-stone-50"
                                                                key={`${e.enclosureId}-${e.enclosureName}`}
                                                                value={`${e.enclosureId}-${e.enclosureName}`}
                                                                onSelect={(currentValue) => {
                                                                    setEnclosureId(currentValue.split("-")[0])
                                                                    setOpenEnclosure(false)
                                                                }}
                                                            >
                                                                <CheckIcon
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        enclosureId === e.enclosureId.toString() ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
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
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="personalityDesc">Personality Description</Label>
                            <Textarea
                                id="personalityDesc"
                                value={personalityDesc}
                                onChange={(e) => setPersonalityDesc(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dietDesc">Diet Description</Label>
                            <Textarea
                                id="dietDesc"
                                value={dietDesc}
                                onChange={(e) => setDietDesc(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="routineDesc">Routine Description</Label>
                            <Textarea
                                id="routineDesc"
                                value={routineDesc}
                                onChange={(e) => setRoutineDesc(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="extraNotes">Extra Notes</Label>
                            <Textarea
                                id="extraNotes"
                                value={extraNotes}
                                onChange={(e) => setExtraNotes(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="text-stone-800" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={updateAnimal.isPending}
                        >
                            {updateAnimal.isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}