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
export type EnclosureWithData = EnclosureBrief & { 
    animals: AnimalWithSpecies[];
    habitat: HabitatBrief;
};

export type Subject = AnimalWithSpecies | EnclosureWithData;