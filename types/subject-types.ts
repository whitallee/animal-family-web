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

export type AnimalWithSpecies = AnimalBrief & { species: SpeciesBrief };
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
}
*/

export type EnclosureWithData = EnclosureBrief & { 
    animals: AnimalWithSpecies[];
    habitat: HabitatBrief;
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
    ]
}
*/

export type Subject = AnimalWithSpecies | EnclosureWithData;