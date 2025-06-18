export type User = {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    // image: string;
    // role: "admin" | "user";
    createdAt: Date;
}

export type Animal = {
    animalId: number;
    animalName: string;
    image: string;
    gender: string;
    dob: string; // TODO: change to Date
    personalityDesc: string;
    dietDesc: string;
    routineDesc: string;
    extraNotes: string;
    speciesId: number;
    enclosureId: number;
}

export type Enclosure = {
    enclosureId: number;
    enclosureName: string;
    image: string;
    notes: string;
    habitatId: number;
}

export type Habitat = {
    habitatId: number;
    habitatName: string;
    habitatDesc: string;
    image: string;
    humidity: string;
    dayTempRange: string;
    nightTempRange: string;
}

export type Species = {
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

export type Task = {
    taskId: number;
    taskName: string;
    taskDesc: string;
    complete: boolean;
    lastCompleted: string; // TODO: change to Date
    repeatIntervHours: number;
    animalId?: number;
    enclosureId?: number;
}