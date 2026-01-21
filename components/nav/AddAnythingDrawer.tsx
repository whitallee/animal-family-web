import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAnimal } from "@/lib/api/animal-mutations";
import { useHabitats, useSpecies } from "@/lib/api/fetch-species-habitats";
import { useAnimals, useEnclosures } from "@/lib/api/fetch-family";
import { Animal, Enclosure, Task } from "@/types/db-types";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateEnclosure } from "@/lib/api/enclosure-mutations";
import { useCreateTask } from "@/lib/api/task-mutations";

export default function AddAnythingDrawer() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'animal' | 'enclosure' | 'task'>('task');

    const { data: species } = useSpecies();
    const { data: enclosures } = useEnclosures();
    const { data: habitats } = useHabitats();
    const { data: animals } = useAnimals();
    
    // Animal form state
    const [animalName, setAnimalName] = useState("");
    const [animalImage, setAnimalImage] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [personalityDesc, setPersonalityDesc] = useState("");
    const [dietDesc, setDietDesc] = useState("");
    const [routineDesc, setRoutineDesc] = useState("");
    const [extraNotes, setExtraNotes] = useState("");
    const [openSpecies, setOpenSpecies] = useState(false);
    const [openEnclosure, setOpenEnclosure] = useState(false);
    const [speciesId, setSpeciesId] = useState("");
    const [enclosureId, setEnclosureId] = useState("");

     // Enclosure form state
     const [enclosureName, setEnclosureName] = useState("");
     const [enclosureImage, setEnclosureImage] = useState("");
     const [enclosureNotes, setEnclosureNotes] = useState("");
     const [openHabitat, setOpenHabitat] = useState(false);
     const [habitatId, setHabitatId] = useState("");

    // Task form state
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [repeatIntervUnitAmt, setRepeatIntervUnitAmt] = useState(0);
    const [repeatIntervUnitType, setRepeatIntervUnitType] = useState("days");
    const [openAnimalInTask, setOpenAnimalInTask] = useState(false);
    const [openEnclosureInTask, setOpenEnclosureInTask] = useState(false);
    const [animalIdSubject, setAnimalIdSubject] = useState(0);
    const [enclosureIdSubject, setEnclosureIdSubject] = useState(0);

    // Mutations
    const createAnimalMutation = useCreateAnimal();
    const createEnclosureMutation = useCreateEnclosure();
    const createTaskMutation = useCreateTask();

    const handleCreateAnimal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const animal: Animal = {
                animalId: 0, // Will be set by backend
                animalName,
                image: animalImage,
                gender,
                dob: dob,
                personalityDesc,
                dietDesc,
                routineDesc,
                extraNotes,
                speciesId: parseInt(speciesId),
                enclosureId: parseInt(enclosureId)
            };
            
            console.log(animal);
            
            await createAnimalMutation.mutateAsync(animal);
            setOpen(false);
            // Reset form
            setAnimalName("");
            setAnimalImage("");
            setGender("");
            setDob("");
            setPersonalityDesc("");
            setDietDesc("");
            setRoutineDesc("");
            setExtraNotes("");
            setSpeciesId("");
            setEnclosureId("");
        } catch (error) {
            console.error('Failed to create animal:', error);
        }
    };

    const handleCreateEnclosure = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const enclosure: Enclosure = {
                enclosureId: 0, // Will be set by backend
                enclosureName: enclosureName,
                image: enclosureImage,
                notes: enclosureNotes,
                habitatId: parseInt(habitatId)
            };

            console.log(enclosure);

            await createEnclosureMutation.mutateAsync(enclosure);
            setOpen(false);
            // Reset form
            setEnclosureName("");
            setEnclosureImage("");
            setEnclosureNotes("");
            setHabitatId("");
        } catch (error) {
            console.error('Failed to create enclosure:', error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();

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

        try {
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

            const task: Task = {
                taskId: 0, // Will be set by backend
                taskName: taskName.trim(),
                taskDesc: taskDesc.trim(),
                complete: false,
                lastCompleted: "",
                repeatIntervHours: repeatIntervHours,
                animalId: animalIdSubject,
                enclosureId: enclosureIdSubject
            };
            
            console.log(task);

            await createTaskMutation.mutateAsync(task);
            setOpen(false);
            // Reset form
            setTaskName("");
            setTaskDesc("");
            setRepeatIntervUnitAmt(0);
            setRepeatIntervUnitType("days");
            setAnimalIdSubject(0);
            setEnclosureIdSubject(0);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Plus className="w-6 h-6 text-stone-500" />
            </DrawerTrigger>
            <DrawerContent className="bg-stone-700 text-stone-50 min-h-[80%]">
                <DrawerHeader>
                    <DrawerTitle className="text-stone-50">Add New</DrawerTitle>
                    <DrawerDescription className="text-stone-400">Create a new animal, enclosure, or task</DrawerDescription>
                </DrawerHeader>
                
                {/* Tab Navigation */}
                <div className="px-4 flex gap-2 mb-4">
                    <Button 
                        variant={activeTab === 'task' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('task')}
                        className="text-stone-50"
                    >
                        Task
                    </Button>
                    <Button 
                        variant={activeTab === 'enclosure' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('enclosure')}
                        className="text-stone-50"
                    >
                        Enclosure
                    </Button>
                    <Button 
                        variant={activeTab === 'animal' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('animal')}
                        className="text-stone-50"
                    >
                        Animal
                    </Button>
                </div>

                {/* Animal Form */}
                {activeTab === 'animal' && (
                    <form onSubmit={handleCreateAnimal} className="px-4 space-y-4 overflow-y-scroll overflow-x-hidden">
                        <div className="space-y-2">
                            <Label htmlFor="animalName" className="text-stone-50">Animal Name</Label>
                            <Input
                                id="animalName"
                                value={animalName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimalName(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Enter animal name"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="animalImage" className="text-stone-50">Image URL</Label>
                            <Input
                                disabled
                                id="animalImage"
                                value={animalImage}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnimalImage(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Enter image URL - currently unavailable"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-stone-50">Gender</Label>
                                <Input
                                    id="gender"
                                    value={gender}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGender(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50"
                                    placeholder="Male/Female/Unknown"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-stone-50">Date of Birth</Label>
                                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="dob"
                                        className="w-full justify-between font-normal bg-stone-600 border-stone-500 text-stone-50 overflow-hidden"
                                    >
                                        {dob ? format(dob, "PPP") : "Select date"}
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
                            <div className="space-y-2">
                                <Label htmlFor="speciesId" className="text-stone-50">Species</Label>
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
                                                    <CommandItem className="bg-stone-600 border-stone-500 text-stone-50"
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

                            <div className="space-y-2">
                                <Label htmlFor="enclosureId" className="text-stone-50">Enclosure</Label>
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
                                                {enclosures?.map((e: Enclosure) => (
                                                    <CommandItem className="bg-stone-600 border-stone-500 text-stone-50"
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

                        <div className="space-y-2">
                            <Label htmlFor="personalityDesc" className="text-stone-50">Personality Description</Label>
                            <Textarea
                                id="personalityDesc"
                                value={personalityDesc}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPersonalityDesc(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Describe the animal's personality"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dietDesc" className="text-stone-50">Diet Description</Label>
                            <Textarea
                                id="dietDesc"
                                value={dietDesc}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDietDesc(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Describe the animal's diet"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="routineDesc" className="text-stone-50">Routine Description</Label>
                            <Textarea
                                id="routineDesc"
                                value={routineDesc}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRoutineDesc(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Describe the animal's routine"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="extraNotes" className="text-stone-50">Extra Notes</Label>
                            <Textarea
                                id="extraNotes"
                                value={extraNotes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExtraNotes(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="Any additional notes"
                                rows={3}
                                required
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full text-stone-50"
                            disabled={createAnimalMutation.isPending}
                        >
                            {createAnimalMutation.isPending ? "Creating..." : "Create Animal"}
                        </Button>
                    </form>
                )}

                {/* Enclosure Form */}
                {activeTab === 'enclosure' && (
                    <form onSubmit={handleCreateEnclosure} className="px-4 space-y-4 overflow-y-scroll overflow-x-hidden">
                    <div className="space-y-2">
                        <Label htmlFor="enclosureName" className="text-stone-50">Enclosure Name</Label>
                        <Input
                            id="enclosureName"
                            value={enclosureName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnclosureName(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter enclosure name"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="enclosureImage" className="text-stone-50">Image URL</Label>
                        <Input
                            disabled
                            id="enclosureImage"
                            value={enclosureImage}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnclosureImage(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter image URL - currently unavailable"
                        />
                    </div>
                        
                    <div className="space-y-2">
                        <Label htmlFor="habitatId" className="text-stone-50">Habitat</Label>
                        <Popover open={openHabitat} onOpenChange={setOpenHabitat}>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openHabitat}
                                className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal text-md overflow-hidden"
                                >
                                {habitatId
                                    ? habitats?.find((h) => h.habitatId.toString() === habitatId)?.habitatName
                                    : "Select habitat"}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                <Command className="bg-stone-600 border-stone-500 text-stone-50">
                                <CommandInput placeholder="Search habitats..." />
                                <CommandList>
                                    <ScrollArea className="h-[150px]">
                                        <CommandEmpty>No habitats found.</CommandEmpty>
                                        <CommandGroup>
                                        {habitats?.map((h) => (
                                            <CommandItem className="bg-stone-600 border-stone-500 text-stone-50"
                                            key={`${h.habitatId}-${h.habitatName}-${h.habitatDesc}`}
                                            value={`${h.habitatId}-${h.habitatName}-${h.habitatDesc}`}
                                            onSelect={(currentValue) => {
                                                setHabitatId(currentValue.split("-")[0])
                                                setOpenHabitat(false)
                                            }}
                                            >
                                            <CheckIcon
                                                className={cn(
                                                "mr-2 h-4 w-4",
                                                habitatId === h.habitatId.toString() ? "opacity-100" : "opacity-0"
                                                )}
                                            />
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

                    <div className="space-y-2">
                        <Label htmlFor="enclosureNotes" className="text-stone-50">Notes</Label>
                        <Textarea
                            id="enclosureNotes"
                            value={enclosureNotes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEnclosureNotes(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Any additional notes"
                            rows={3}
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full text-stone-50"
                        disabled={createEnclosureMutation.isPending}
                    >
                        {createEnclosureMutation.isPending ? "Creating..." : "Create Enclosure"}
                    </Button>
                </form>
                )}

                {/* Task Form */}
                {activeTab === 'task' && (
                    <form onSubmit={handleCreateTask} className="px-4 space-y-4 overflow-y-scroll overflow-x-hidden">
                    <div className="space-y-2">
                        <Label htmlFor="taskName" className="text-stone-50">Task Name</Label>
                        <Input
                            id="taskName"
                            value={taskName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter task name"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="taskDesc" className="text-stone-50">Task Notes</Label>
                        <Textarea
                            id="taskDesc"
                            value={taskDesc}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTaskDesc(e.target.value)}
                            className="bg-stone-600 border-stone-500 text-stone-50"
                            placeholder="Enter task notes"
                            rows={3}
                            required
                        />
                    </div>
                        
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="text-stone-500 col-span-2">Select either an animal or an enclosure</div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="animalId" className="text-stone-50">Animal</Label>
                            <Popover open={openAnimalInTask} onOpenChange={setOpenAnimalInTask}>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openAnimalInTask}
                                    className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal text-md overflow-hidden"
                                    >
                                    {animalIdSubject
                                        ? animals?.find((a: Animal) => a.animalId === animalIdSubject)?.animalName
                                        : "Select animal"}
                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0 bg-stone-600 border-stone-500 text-stone-50">
                                    <Command className="bg-stone-600 border-stone-500 text-stone-50">
                                    <CommandInput placeholder="Search animals..." />
                                    <CommandList>
                                        <ScrollArea className="h-[150px]">
                                            <CommandEmpty>No animals found.</CommandEmpty>
                                            <CommandGroup>
                                            {animals?.map((a: Animal) => (
                                                <CommandItem className="bg-stone-600 border-stone-500 text-stone-50"
                                                key={`${a.animalId}-${a.animalName}`}
                                                value={`${a.animalId}-${a.animalName}`}
                                                onSelect={(currentValue) => {
                                                    setAnimalIdSubject(parseInt(currentValue.split("-")[0]))
                                                    setEnclosureIdSubject(0)
                                                    setOpenAnimalInTask(false)
                                                }}
                                                >
                                                <CheckIcon
                                                    className={cn(
                                                    "mr-2 h-4 w-4",
                                                    animalIdSubject === a.animalId ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
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

                        <div className="space-y-2">
                            <Label htmlFor="enclosureId" className="text-stone-50">Enclosure</Label>
                            <Popover open={openEnclosureInTask} onOpenChange={setOpenEnclosureInTask}>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openEnclosureInTask}
                                    className="w-full justify-between bg-stone-600 border-stone-500 text-stone-300 font-normal text-md overflow-hidden"
                                    >
                                    {enclosureIdSubject
                                        ? enclosures?.find((e: Enclosure) => e.enclosureId === enclosureIdSubject)?.enclosureName
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
                                            {enclosures?.map((e: Enclosure) => (
                                                <CommandItem className="bg-stone-600 border-stone-500 text-stone-50"
                                                key={`${e.enclosureId}-${e.enclosureName}-${e.notes}`}
                                                value={`${e.enclosureId}-${e.enclosureName}-${e.notes}`}
                                                onSelect={(currentValue) => {
                                                    setEnclosureIdSubject(parseInt(currentValue.split("-")[0]))
                                                    setAnimalIdSubject(0)
                                                    setOpenEnclosureInTask(false)
                                                }}
                                                >
                                                <CheckIcon
                                                    className={cn(
                                                    "mr-2 h-4 w-4",
                                                    enclosureIdSubject === e.enclosureId ? "opacity-100" : "opacity-0"
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

                    <div className="space-y-2">
                        <Label htmlFor="repeatIntervHours" className="text-stone-50">Repeat Interval</Label>
                        <div className="text-stone-500 flex flex-row gap-2 items-center">
                            <div className="text-stone-500">Every</div>
                            <Input
                                id="repeatIntervHours"
                                type="number"
                                min={1}
                                value={repeatIntervUnitAmt}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatIntervUnitAmt(parseInt(e.target.value))}
                                className="bg-stone-600 border-stone-500 text-stone-50"
                                placeholder="3"
                                required
                            />
                            <select 
                                id="repeatIntervUnitType"
                                value={repeatIntervUnitType}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRepeatIntervUnitType(e.target.value)}
                                className="bg-stone-600 border-stone-500 text-stone-50 py-1 px-3 rounded-md border h-9"
                            >
                                <option value="hours">hours</option>
                                <option value="days">days</option>
                                <option value="weeks">weeks</option>
                                <option value="months">months</option>
                                <option value="years">years</option>
                            </select>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full text-stone-50"
                        disabled={createTaskMutation.isPending}
                    >
                        {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                    </Button>
                </form>
                )}

                <DrawerFooter className="max-w-md min-w-[12rem] sm:min-w-[24rem] mx-auto p-3">
                    <DrawerClose asChild>
                        <Button variant="outline" className="text-stone-800 p-1">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}