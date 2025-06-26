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
import { Calendar as CalendarIcon, CheckIcon, ChevronDownIcon, ChevronsUpDownIcon, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAnimal } from "@/lib/api/animal-mutations";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
import { useEnclosures } from "@/lib/api/fetch-family";
import { Animal, Enclosure } from "@/types/db-types";
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

export default function AddAnythingDrawer() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'animal' | 'enclosure' | 'task'>('animal');
    
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

    const createAnimalMutation = useCreateAnimal();
    const { data: species, isPending: speciesPending } = useSpecies();
    const { data: enclosures, isPending: enclosuresPending } = useEnclosures();

    const handleCreateAnimal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Format the date to include time if provided, otherwise use current time
            const formattedDob = dob ? `${dob}T00:00:00Z` : new Date().toISOString();
            
            const animal: Animal = {
                animalId: 0, // Will be set by backend
                animalName,
                image: animalImage,
                gender,
                dob: formattedDob,
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

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Plus className="w-6 h-6 text-stone-500" />
            </DrawerTrigger>
            <DrawerContent className="bg-stone-700 text-stone-50 min-h-[95%]">
                <DrawerHeader>
                    <DrawerTitle className="text-stone-50">Add New</DrawerTitle>
                    <DrawerDescription className="text-stone-400">Create a new animal, enclosure, or task</DrawerDescription>
                </DrawerHeader>
                
                {/* Tab Navigation */}
                <div className="px-4 flex gap-2 mb-4">
                    <Button 
                        variant={activeTab === 'animal' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('animal')}
                        className="text-stone-50"
                    >
                        Animal
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
                        variant={activeTab === 'task' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('task')}
                        className="text-stone-50"
                    >
                        Task
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
                                {/* <Input
                                    id="dob"
                                    type="date"
                                    value={dob}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50"
                                    required
                                /> */}
                                {/* <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant="outline"
                                        data-empty={!dob}
                                        className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-stone-600 border-stone-500 text-stone-50"
                                        >
                                        <CalendarIcon />
                                        {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-stone-600 border-stone-500 text-stone-50 min-h-[336px]">
                                        <Calendar mode="single" selected={dob ? new Date(dob) : undefined} onSelect={(date) => setDob(date?.toISOString() || "")} />
                                    </PopoverContent>
                                </Popover> */}
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
                                {/* <select
                                    id="speciesId"
                                    value={speciesId}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSpeciesId(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                                    required
                                    disabled={speciesPending}
                                >
                                    <option value="">Select a species</option>
                                    {species?.map((s) => (
                                        <option key={s.speciesId} value={s.speciesId}>
                                            {s.comName} ({s.sciName})
                                        </option>
                                    ))}
                                </select> */}
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
                                        </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="enclosureId" className="text-stone-50">Enclosure</Label>
                                {/* <select
                                    id="enclosureId"
                                    value={enclosureId}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEnclosureId(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                                    required
                                    disabled={enclosuresPending}
                                >
                                    <option disabled value="">Select an enclosure</option>
                                    <option value="0">No Enclosure</option>
                                    {enclosures?.map((e: Enclosure) => (
                                        <option key={e.enclosureId} value={e.enclosureId}>
                                            {e.enclosureName}
                                        </option>
                                    ))}
                                </select> */}
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

                {/* Enclosure Form - Disabled */}
                {activeTab === 'enclosure' && (
                    <div className="px-4 space-y-4">
                        <p className="text-stone-400 text-center py-8">Enclosure creation coming soon...</p>
                        <Button disabled className="w-full text-stone-50">Create Enclosure</Button>
                    </div>
                )}

                {/* Task Form - Disabled */}
                {activeTab === 'task' && (
                    <div className="px-4 space-y-4">
                        <p className="text-stone-400 text-center py-8">Task creation coming soon...</p>
                        <Button disabled className="w-full text-stone-50">Create Task</Button>
                    </div>
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