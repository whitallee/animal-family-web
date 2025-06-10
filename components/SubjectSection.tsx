import { Animal, Enclosure, Habitat, Species } from "@/types/db-types";
import Image from "next/image";

type AnimalWithSpecies = Animal & { species: Species };
type EnclosureWithData = Enclosure & { 
    animals: AnimalWithSpecies[];
    habitat: Habitat;
};

function organizeAnimalFamily(enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[]): EnclosureWithData[] {
    const unassignedEnclosure: EnclosureWithData = {
        enclosureId: -1,
        enclosureName: "Unassigned",
        image: "",
        notes: "Animals without an assigned enclosure",
        habitatId: 1,
        animals: animals
            .filter(animal => !animal.enclosureId)
            .map(animal => ({
                ...animal,
                species: species.find(s => s.speciesId === animal.speciesId)!
            })),
        habitat: habitats.find(h => h.habitatId === 1)!
    };

    const assignedEnclosures = enclosures.map(enclosure => {
        const enclosureAnimals = animals
            .filter(animal => animal.enclosureId === enclosure.enclosureId)
            .map(animal => ({
                ...animal,
                species: species.find(s => s.speciesId === animal.speciesId)!
            }));
        
        return {
            ...enclosure,
            animals: enclosureAnimals,
            habitat: habitats.find(h => h.habitatId === enclosure.habitatId)!
        };
    });

    return [unassignedEnclosure,...assignedEnclosures];
}

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

function SubjectList({ subjects }: { subjects: EnclosureWithData[] }) {
    const modifiedSubjects = subjects.map((subject, index) => ({
        ...subject,
        shift: (index + 1) % 5 === 4 || (index + 1) % 5 === 0
    }));

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
                    subject={subject.enclosureId ? subject : undefined} 
                    shift={subject.shift} 
                    placeholder={subject.placeholder} 
                    key={subject.enclosureId || `placeholder-${index}`}
                />
            ))}
        </>
    )
}

function SubjectCircle({ subject, shift, placeholder, className }: { subject?: EnclosureWithData, shift?: boolean, placeholder?: boolean, className?: string }) {
    if (placeholder) {
        return (
            <div className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""} ${className || ""}`}>
                <p className="text-white relative z-10"></p>
            </div>
        )
    }
    if (subject?.enclosureId === -1) {
        return (
            <div className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""} ${className || ""}`}>
                <p className="text-white relative z-10">{subject?.enclosureName}<br/>{subject?.animals.length}</p>
            </div>
        )
    }
    return (
        <div 
            className={`bg-stone-700 rounded-full aspect-square flex items-center justify-center relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""} ${className || ""}`}
        >
            {subject?.enclosureId && (
                <Image 
                    // src={subject.enclosureId !== -1 ? subject.image : subject.habitat.image}
                    src={subject.habitat.image}
                    alt=""
                    fill
                    // unoptimized
                    className="object-cover"
                    onError={(e) => {
                        console.error('Image failed to load:', subject.habitat.image);
                    }}
                />
            )}
            <p className="text-white relative z-10">{subject?.enclosureName}<br/>{subject?.animals.length}</p>
        </div>
    )
}

export default function SubjectSection({ enclosures, animals, habitats, species, isPending }: { enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[], isPending: boolean }) {
    const animalFamily = organizeAnimalFamily(enclosures, animals, habitats, species);
    
    return (
        <div className="grid max-w-md my-6 grid-cols-3 w-full content-center gap-x-4 gap-y-0 overflow-y-scroll overflow-x-hidden">
            {isPending ? <SubjectSkeletonList /> : <SubjectList subjects={animalFamily} />}
        </div>
    )
}