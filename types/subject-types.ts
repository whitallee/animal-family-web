import { Animal, Enclosure, Habitat, Species, Task } from "./db-types";

export type AnimalBrief = {
    animalId: number;
    animalName: string;
    animalImage: string;
}
export type SpeciesBrief = {
    speciesId: number;
    speciesName: string;
    speciesImage: string;
}
export type EnclosureBrief = {
    enclosureId: number;
    enclosureName: string;
    enclosureImage: string;
}
export type HabitatBrief = {
    habitatId: number;
    habitatName: string;
    habitatImage: string;
}

export type AnimalWithSpecies = AnimalBrief & { species: SpeciesBrief; tasks: Task[] };
/*
{
    animalId: number;
    animalName: string;
    animalImage: string;
    species: {
        speciesId: number;
        speciesName: string;
        speciesImage: string;
    }
    tasks: [
        {
            taskId: number;
            taskName: string;
            taskDesc: string;
        }
    ]
}
*/

export type AnimalSubjectLong = Animal & {
    species: Species;
    enclosure?: Enclosure;
    habitat?: Habitat;
    tasks: Task[];
}

/*
{
    animalId: number;
    animalName: string;
    image: string;
    gender: string;
    dob: Date;
    personalityDesc: string;
    dietDesc: string;
    routineDesc: string;
    extraNotes: string;
    speciesId: number;
    enclosureId: number;
    species: {
        speciesId: number;
        comName: string;
        sciName: string;
        image: string;
        speciesDesc: string;
        habitatId: number;
        baskTemp: string;
        diet: string;
        sociality: string;
        lifespan: string;
        size: string;
        weight: string;
        conservationStatus: string;
        extraCare: string;
    }
}
*/

export type EnclosureWithData = EnclosureBrief & { 
    animals: AnimalWithSpecies[];
    habitat: HabitatBrief;
    tasks: Task[];
};
/*
{
    enclosureId: number;
    enclosureName: string;
    enclosureImage: string;
    habitat: {
        habitatId: number;
        habitatName: string;
        habitatImage: string;
    }
    animals: [
        {
            animalId: number;
            animalName: string;
            animalImage: string;
            species: {
                speciesId: number;
                speciesName: string;
                speciesImage: string;
            }
        },
        ...
    ],
    tasks: [
        {
            taskId: number;
            taskName: string;
            taskDesc: string;
        }
        ...
    ]
}
*/

export type Subject = AnimalWithSpecies | EnclosureWithData;