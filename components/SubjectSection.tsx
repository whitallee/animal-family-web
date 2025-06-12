import { Animal, Enclosure, Habitat, Species } from "@/types/db-types";
import Image from "next/image";
import { Subject, AnimalWithSpecies } from "@/types/subject-types";
import AnimalsInEnclosure from "./AnimalsInEnclosure";
import { organizeAnimalFamily } from "@/lib/helpers";

function SubjectSkeletonList() {
    return (
        <>
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} placeholder={true} />
            {/* repeat this pattern in a map */}
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} className="animate-pulse" />
            <SubjectCircle shift={true} placeholder={true} />
        </>
    )
}

function SubjectList({ subjects }: { subjects: Subject[] }) {
    const modifiedSubjects = subjects.map((subject, index) => ({
        ...subject,
        shift: (index + 1) % 5 === 4 || (index + 1) % 5 === 0
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subjectsWithPlaceholders = modifiedSubjects.reduce((accumulator: any[], subject, index) => {
        accumulator.push(subject);
        if ((index + 1) % 5 === 0) {
            accumulator.push({ placeholder: true });
        }
        return accumulator;
    }, []);
    return (
        <>
            {subjectsWithPlaceholders.map((subject, index) => (
                <SubjectCircle
                    className="text-xs"
                    subject={subject.enclosureId || subject.animalId ? subject as Subject : undefined} 
                    shift={subject.shift} 
                    placeholder={subject.placeholder} 
                    key={subject.enclosureId ? `enclosure-${subject.enclosureId}` : subject.animalId ? `animal-${subject.animalId}` : `placeholder-${index}`}
                />
            ))}
        </>
    )
}

function SubjectCircle({ subject, shift, placeholder, className }: { subject?: Subject, shift?: boolean, placeholder?: boolean, className?: string }) {
    if (placeholder || !subject ) {
        return (
            <div className={`bg-stone-700 rounded-full aspect-square relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""} ${className || ""}`}>
            </div>
        )
    }
    if ("animalId" in subject) {
        return (
            <div 
                className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${className || ""}`}
            >
                <Image 
                    src={subject.animalImage === "" ? subject.species.speciesImage : subject.animalImage}
                    alt={subject.animalName}
                    fill
                    sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                    className="object-cover relative"
                    onError={() => {
                        console.error('Image failed to load:', subject.animalImage);
                    }}
                    />
                {/* <p className="text-white relative z-10">{subject.animalName}<br/>{subject.species.speciesName}</p> */}
            </div>
        )
    }
    if ("enclosureId" in subject) {
        return (
            <div 
                className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${className || ""}`}
            >
                <Image 
                    src={subject.enclosureImage === "" ? subject.habitat.habitatImage : subject.enclosureImage}
                    alt={subject.enclosureName}
                    fill
                    sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => {
                        console.error('Image failed to load:', subject.enclosureImage);
                    }}
                    />
                <AnimalsInEnclosure animals={subject.animals} />
            </div>
        )
    }
}

export default function SubjectSection({ enclosures, animals, habitats, species, isPending }: { enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[], isPending: boolean }) {
    const animalFamily = organizeAnimalFamily(enclosures, animals, habitats, species);
    
    return (
        <div className="grid max-w-md my-6 grid-cols-3 w-full content-center gap-x-4 gap-y-0 overflow-y-scroll overflow-x-hidden">
            {isPending ? <SubjectSkeletonList /> : <SubjectList subjects={animalFamily} />}
        </div>
    )
}