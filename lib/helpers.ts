import { Animal, Enclosure, Habitat, Species } from "@/types/db-types";
import { AnimalWithSpecies, EnclosureWithData, Subject } from "@/types/subject-types";

export function organizeAnimalFamily(enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[]): Subject[] {
    const unassignedAnimals: AnimalWithSpecies[] = animals.filter(animal => !animal.enclosureId).map(animal => animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!));

    const assignedEnclosures = enclosures.map(enclosure => {
        return enclosureToSubject(enclosure, animals, habitats, species);
    });

    const sortedEnclosures = assignedEnclosures.sort((b, a) => 
        a.habitat.habitatName.localeCompare(b.habitat.habitatName)
    );

    return [...unassignedAnimals, ...sortedEnclosures];
}

export function animalToSubject(animal: Animal, species: Species): AnimalWithSpecies {
    return {
        animalId: animal.animalId,
        animalName: animal.animalName,
        animalImage: animal.image,
    species: {
        speciesId: species.speciesId,
        speciesName: species.comName,
        speciesImage: species.image
    }
    }
}

export function enclosureToSubject(enclosure: Enclosure, animals: Animal[], habitats: Habitat[], species: Species[]): EnclosureWithData {
    const enclosureAnimals = animals
        .filter(animal => animal.enclosureId === enclosure.enclosureId)
        .map(animal => animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!));
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
    }
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