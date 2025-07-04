import { AnimalWithSpecies } from "@/types/subject-types";
import Image from "next/image";

export default function AnimalsInEnclosure({ animals, small, className, enclosureFocus }: { animals: AnimalWithSpecies[], small?: boolean, className?: string, enclosureFocus?: boolean }) {
    if (animals.length === 0) {
        return null;
    // } else if (animals.length === 1) {
    } else  {
        return (
            <div 
                className={`rounded-full aspect-square gap-2 relative flex items-center justify-center flex-wrap content-center ${className || ""}`}
            >
            {animals.map((animal) => (
                <div key={animal.animalId} className={`relative aspect-square overflow-hidden ${small && animals.length === 1 ? "h-10 w-10" : small && animals.length === 2 ? "h-6 w-6" : small && animals.length > 2 ? "h-5 w-5" : animals.length === 1 ? "h-20 w-20" : animals.length === 2 ? "h-10 w-10" : "h-8 w-8 min-[400px]:h-10 min-[400px]:w-10"}`}>
                    <Image 
                        src={animal.animalImage === "" ? animal.species.speciesImage : animal.animalImage}
                        alt={animal.animalName}
                        fill
                        sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                        className={`object-cover rounded-full ${enclosureFocus ? "opacity-[0.4]" : "opacity-100"}`}
                        onError={() => {
                            console.error('Image failed to load:', animal.animalImage);
                        }}
                    />
                </div>
            ))}
            </div>
        )    
    }
}