import { Animal, Enclosure, Habitat, Species, Task } from "@/types/db-types";
import { Subject } from "@/types/subject-types";
import Image from "next/image";
import AnimalsInEnclosure from "./AnimalsInEnclosure";
import { hasIncompleteTasks, organizeAnimalFamily } from "@/lib/helpers";
import { SubjectSkeletonList } from "@/components/Skeletons";


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

export function SubjectCircle({ subject, shift, placeholder, className }: { subject?: Subject, shift?: boolean, placeholder?: boolean, className?: string }) {
    if (placeholder || !subject ) {
        return (
            <div className={`bg-stone-700 rounded-full aspect-square relative overflow-hidden ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${placeholder ? "opacity-0" : ""} ${className || ""}`}>
            </div>
        )
    }
    if ("animalId" in subject) {
        const hasIncomplete = hasIncompleteTasks(subject);
        return (
            <>
            <div 
                className={`bg-transparent aspect-square flex items-center justify-center relative ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${className || ""}`}
            >
                <Image 
                    src={subject.animalImage === "" ? subject.species.speciesImage : subject.animalImage}
                    alt={subject.animalName}
                    fill
                    sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                    className="object-cover relative rounded-full"
                    onError={() => {
                        console.error('Image failed to load:', subject.animalImage);
                    }}
                    />
                {hasIncomplete ? 
                <>
                    <div className="w-4 h-4 absolute top-1.5 right-1.5 bg-emerald-400 rounded-full" />
                    <div className="w-4 h-4 absolute top-1.5 right-1.5 bg-emerald-400 rounded-full animate-ping" />
                </> : null}
            </div>
            </>
        )
    }
    if ("enclosureId" in subject) {
        const hasIncomplete = hasIncompleteTasks(subject);
        return (
            <div 
                className={`bg-transparent aspect-square flex items-center justify-center relative ${shift ? "translate-x-[calc(50%+8px)]" : ""} ${className || ""}`}
            >
                <Image 
                    src={subject.enclosureImage === "" ? subject.habitat.habitatImage : subject.enclosureImage}
                    alt={subject.enclosureName}
                    fill
                    sizes="(max-width: 512px) 100vw, (max-width: 128px) 50vw, 33vw"
                    className="object-cover relative rounded-full"
                    onError={() => {
                        console.error('Image failed to load:', subject.enclosureImage);
                    }}
                    />
                <AnimalsInEnclosure animals={subject.animals} />
                {/* <div className="absolute top-0 left-0 w-full h-full flex flex-wrap gap-1 content-center justify-center">
                    {subject.animals.map((animal, index) => (
                        <SubjectCircle subject={animal} className="w-10 h-10" />
                    ))}
                </div> */}
                {hasIncomplete ? 
                <>
                    <div className="w-4 h-4 absolute top-1.5 right-1.5 bg-emerald-400 rounded-full" />
                    <div className="w-4 h-4 absolute top-1.5 right-1.5 bg-emerald-400 rounded-full animate-ping" />
                </> : null}

            </div>
        )
    }
}

export default function SubjectSection({ tasks, enclosures, animals, habitats, species, isPending }: { tasks: Task[], enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[], isPending: boolean }) {    
    return (
        <div className="grid max-w-md my-6 grid-cols-3 w-full content-center gap-x-4 gap-y-0 overflow-y-scroll overflow-x-hidden">
            {isPending ? <SubjectSkeletonList /> : <SubjectList subjects={organizeAnimalFamily(enclosures, animals, habitats, species, tasks)} />}
        </div>
    )
}