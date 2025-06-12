import { Animal, Enclosure, Habitat, Species } from "@/types/db-types";
import { AnimalWithSpecies, Subject } from "@/types/subject-types";

export function organizeAnimalFamily(enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[]): Subject[] {
    const unassignedAnimals: AnimalWithSpecies[] = animals.filter(animal => !animal.enclosureId).map(animal => ({
        animalId: animal.animalId,
        animalName: animal.animalName,
        animalImage: animal.image,
        species: {
            speciesId: animal.speciesId,
            speciesName: species.find(s => s.speciesId === animal.speciesId)!.comName,
            speciesImage: species.find(s => s.speciesId === animal.speciesId)!.image
        }
    }));

    const assignedEnclosures = enclosures.map(enclosure => {
        const enclosureAnimals: AnimalWithSpecies[] = animals
            .filter(animal => animal.enclosureId === enclosure.enclosureId)
            .map(animal => ({
                animalId: animal.animalId,
                animalName: animal.animalName,
                animalImage: animal.image,
                species: {
                    speciesId: animal.speciesId,
                    speciesName: species.find(s => s.speciesId === animal.speciesId)!.comName,
                    speciesImage: species.find(s => s.speciesId === animal.speciesId)!.image
                }
            }));
        
        return {
            enclosureId: enclosure.enclosureId,
            enclosureName: enclosure.enclosureName,
            enclosureImage: enclosure.image,
            animals: enclosureAnimals,
            habitat: {
                habitatId: enclosure.habitatId,
                habitatName: habitats.find(h => h.habitatId === enclosure.habitatId)!.habitatName,
                habitatImage: habitats.find(h => h.habitatId === enclosure.habitatId)!.image
            }
        };
    });

    const sortedEnclosures = assignedEnclosures.sort((b, a) => 
        a.habitat.habitatName.localeCompare(b.habitat.habitatName)
    );

    return [...unassignedAnimals, ...sortedEnclosures];
}

// TODO: attach tasks to subjects by using the joining table taskSubject

// export function addTaskToSubjects(subjects: Subject[], task: Task) {
//     return subjects.map(subject => {
//         if ("enclosureId" in subject) {
//             return {
//                 ...subject,
//                 animals: subject.animals.map(animal => ({
//                     ...animal,
//                     tasks: [...(animal.task || []), task]
//                 }))
//             };
//         }
//         return subject;
//     });
// }