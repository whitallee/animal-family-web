import { Animal, Enclosure, Habitat, Species, Task } from "@/types/db-types";
import { AnimalSubjectLong, AnimalWithSpecies, EnclosureSubjectLong, EnclosureWithData, Subject } from "@/types/subject-types";

export function organizeAnimalFamily(enclosures: Enclosure[], animals: Animal[], habitats: Habitat[], species: Species[], tasks: Task[]): Subject[] {
    const unassignedAnimals: AnimalWithSpecies[] = animals.filter(animal => !animal.enclosureId).map(animal => animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks.filter(task => task.animalId === animal.animalId)));

    const assignedEnclosures = enclosures.map(enclosure => {
        return enclosureToSubject(enclosure, animals, habitats, species, tasks);
    });

    const sortedEnclosures = assignedEnclosures.sort((b, a) => 
        a.habitat.habitatName.localeCompare(b.habitat.habitatName)
    );

    return [...unassignedAnimals, ...sortedEnclosures];
}

export function animalToSubject(animal: Animal, species: Species, tasks: Task[]): AnimalWithSpecies {
    return {
        animalId: animal.animalId,
        animalName: animal.animalName,
        animalImage: animal.image,
    species: {
        speciesId: species.speciesId,
        speciesName: species.comName,
        speciesImage: species.image
    },
    tasks: tasks.filter(task => task.animalId === animal.animalId)
    }
}

export function animalToSubjectLong(animal: Animal, species: Species, tasks: Task[], enclosures: Enclosure[], habitats: Habitat[]): AnimalSubjectLong {
    const enclosure = enclosures.find(enclosure => enclosure.enclosureId === animal.enclosureId);
    const habitat = habitats.find(habitat => habitat.habitatId === enclosure?.habitatId) || null;
    return {
        ...animal,
        species: species,
        tasks: tasks.filter(task => task.animalId === animal.animalId),
        enclosure: enclosure || undefined,
        habitat: habitat || undefined
    }
}

export function enclosureToSubject(enclosure: Enclosure, animals: Animal[], habitats: Habitat[], species: Species[], tasks: Task[]): EnclosureWithData {
    const enclosureAnimals = animals
        .filter(animal => animal.enclosureId === enclosure.enclosureId)
        .map(animal => animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks));
    return {
        enclosureId: enclosure.enclosureId,
        enclosureName: enclosure.enclosureName,
        enclosureImage: enclosure.image,
        animals: enclosureAnimals,
        habitat: {
            habitatId: enclosure.habitatId,
            habitatName: habitats.find(h => h.habitatId === enclosure.habitatId)!.habitatName,
            habitatImage: habitats.find(h => h.habitatId === enclosure.habitatId)!.image
        },
        tasks: tasks.filter(task => task.enclosureId === enclosure.enclosureId)
    }
}

export function enclosureToSubjectLong(enclosure: Enclosure, animals: Animal[], tasks: Task[], habitats: Habitat[], species: Species[]): EnclosureSubjectLong {
    return {
        ...enclosure,
        animals: animals.filter(animal => animal.enclosureId === enclosure.enclosureId).map(animal => animalToSubject(animal, species.find(s => s.speciesId === animal.speciesId)!, tasks.filter(task => task.animalId === animal.animalId))),
        tasks: tasks.filter(task => task.enclosureId === enclosure.enclosureId),
        habitat: habitats.find(h => h.habitatId === enclosure.habitatId)!
    }
}

export function ReadableTime(interval: number) {
    if (Math.round((interval/8760)*10)/10 > 1) {
        return `${(interval / 8760).toFixed(1)} years`;
    } else if ((interval/8760).toFixed(1) === "1.0") {
        return `1 year`;
    } else if (Math.round((interval/720)*10)/10 > 1) {
        return `${(interval / 720).toFixed(1)} months`;
    } else if ((interval/720).toFixed(1) === "1.0") {
        return `1 month`;
    } else if (Math.round((interval/168)*10)/10 > 1) {
        return `${(interval / 168).toFixed(1)} weeks`;
    } else if ((interval/168).toFixed(1) === "1.0") {
        return `1 week`;
    } else if (Math.round((interval/24)*10)/10 > 1) {
        return `${(interval / 24).toFixed(1)} days`;
    } else if ((interval/24).toFixed(1) === "1.0") {
        return `1 day`;
    } else if (Math.round((interval/1)*10)/10 > 1) {
        return `${interval.toFixed(1)} hours`;
    } else if ((interval/1).toFixed(1) === "1.0") {
        return `1 hour`;
    } else {
        return `${(interval * 60).toFixed(1)} minutes`;
    }
}

export const hoursSinceDue = (task: Task): number => {
    return ((new Date().getTime() - (new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000)) / 1000 / 60 / 60);
}

export const hoursUntilDue = (task: Task) => {
    return ((new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000) - new Date().getTime()) / 1000 / 60 / 60;
}

export const dateDue = (task: Task) => {
    return new Date(new Date(task.lastCompleted).getTime() + task.repeatIntervHours * 60 * 60 * 1000);
}

// Helper function to check if subject has incomplete tasks
export function hasIncompleteTasks(subject: Subject): boolean {
    if ("animalId" in subject) {
        return subject.tasks.some(task => !task.complete);
    }
    if ("enclosureId" in subject) {
        return subject.tasks.some(task => !task.complete) || subject.animals.some(animal => animal.tasks.some(task => !task.complete));
    }
    return false;
}

// Helper function to check if subject has incomplete tasks that are overdue
export function hasOverdueTasks(subject: Subject): boolean {
    if ("animalId" in subject) {
        return subject.tasks.some(task => !task.complete && hoursSinceDue(task) > 24);
    } else if ("enclosureId" in subject) {
        return subject.tasks.some(task => !task.complete && hoursSinceDue(task) > 24) || subject.animals.some(animal => animal.tasks.some(task => !task.complete && hoursSinceDue(task) > 24));
    }
    return false;
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