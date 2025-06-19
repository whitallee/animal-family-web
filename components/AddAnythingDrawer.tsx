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
import { Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAnimal } from "@/lib/api/animal-mutations";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
import { useEnclosures } from "@/lib/api/fetch-family";
import { Animal, Enclosure } from "@/types/db-types";
import { Textarea } from "@/components/ui/textarea";

export default function AddAnythingDrawer() {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'animal' | 'enclosure' | 'task'>('animal');
    
    // Animal form state
    const [animalName, setAnimalName] = useState("");
    const [animalImage, setAnimalImage] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [personalityDesc, setPersonalityDesc] = useState("");
    const [dietDesc, setDietDesc] = useState("");
    const [routineDesc, setRoutineDesc] = useState("");
    const [extraNotes, setExtraNotes] = useState("");
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
            <DrawerContent className="bg-stone-700 text-stone-50">
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
                    <form onSubmit={handleCreateAnimal} className="px-4 space-y-4 overflow-y-scroll">
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
                                <Input
                                    id="dob"
                                    type="date"
                                    value={dob}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDob(e.target.value)}
                                    className="bg-stone-600 border-stone-500 text-stone-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="speciesId" className="text-stone-50">Species</Label>
                                <select
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
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="enclosureId" className="text-stone-50">Enclosure</Label>
                                <select
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
                                </select>
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

                <DrawerFooter className="max-w-md min-w-[20rem] sm:min-w-[24rem] mx-auto">
                    <DrawerClose asChild>
                        <Button variant="outline" className="text-stone-800">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}