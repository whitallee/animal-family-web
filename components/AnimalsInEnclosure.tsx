import { AnimalWithSpecies } from "@/types/subject-types";
import Image from "next/image";

export default function AnimalsInEnclosure({ animals, className }: { animals: AnimalWithSpecies[], className?: string }) {
    if (animals.length === 0) {
        return null;
    // } else if (animals.length === 1) {
    } else {
        return (
            <div 
                className={`w-[80%] h-[80%] p-10 rounded-full aspect-square grid gap-2 ${className || ""}`}
            >
            {animals.map((animal) => (

                <Image 
                    key={animal.animalId}
                    src={animal.animalImage === "" ? animal.species.speciesImage : animal.animalImage}
                    alt={animal.animalName}
                    fill
                    sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                    className="object-cover rounded-full aspect-square scale-50"
                    onError={() => {
                        console.error('Image failed to load:', animal.animalImage);
                    }}
                    />
            ))}
            </div>
        )    
    }
    //     return (
    //         <div className={`flex ${className || ""}`}>
    //             {animals.map((animal) => (
    //                 <p className="text-white relative z-10" key={animal.animalId}>{animal.animalName}</p>
    //             ))}
    //         </div>
    //     )
    // }
}