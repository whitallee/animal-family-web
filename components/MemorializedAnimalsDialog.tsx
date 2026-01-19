import { useState, useMemo } from "react";
import { useAnimals } from "@/lib/api/fetch-family";
import { useSpecies } from "@/lib/api/fetch-species-habitats";
import { Animal, Species } from "@/types/db-types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { EditMemorialButton } from "@/components/EditComponents";

export default function MemorializedAnimalsDialog() {
    const [open, setOpen] = useState(false);
    const { data: animals } = useAnimals();
    const { data: species } = useSpecies();
    
    const memorializedAnimals = useMemo(() => {
        return animals?.filter((animal: Animal) => animal.isMemorialized) ?? [];
    }, [animals]);

    const getSpeciesImage = (speciesId: number): string => {
        const speciesData = species?.find((s: Species) => s.speciesId === speciesId);
        return speciesData?.image || "";
    };

    if (memorializedAnimals.length === 0) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 text-stone-50 bg-stone-600">
                    <Heart className="w-4 h-4 mr-2" />
                    Memorialized Animals ({memorializedAnimals.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Memorialized Animals</DialogTitle>
                    <DialogDescription>
                        Remembering the animals who have passed
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                    {memorializedAnimals.map((animal: Animal) => (
                        <div key={animal.animalId} className="flex gap-4 p-4 bg-stone-800 rounded-lg items-center">
                            <div className="relative w-24 h-24 min-w-24 min-h-24 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={getSpeciesImage(animal.speciesId) || ""}
                                    alt={animal.animalName}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                    onError={() => {
                                        console.error('Image failed to load for species:', animal.speciesId);
                                    }}
                                />
                            </div>
                            <div className="flex gap-2 flex-1 min-w-0">
                                <div className="flex flex-col flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-stone-50 mb-1">{animal.animalName}</h3>
                                    {animal.lastMessage && (
                                        <p className="text-stone-300 text-sm whitespace-pre-wrap break-words">{animal.lastMessage}</p>
                                    )}
                                    {(animal.dob || animal.memorialDate) && (
                                        <p className="text-stone-400 text-xs mt-2">
                                            {animal.dob ? new Date(animal.dob).toLocaleDateString() : "?"} - {animal.memorialDate ? new Date(animal.memorialDate).toLocaleDateString() : "?"}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-shrink-0 self-start">
                                    <EditMemorialButton animal={animal} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

