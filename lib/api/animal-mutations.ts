import { Animal } from "@/types/db-types";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";
import { fetchAnimals } from "./fetch-family";

export const createAnimal = async (token: string, animal: Animal) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/animal`, {
        method: "POST",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "animalName": animal.animalName,
            "image": animal.image,
            "gender": animal.gender,
            "dob": animal.dob,
            "personalityDesc": animal.personalityDesc,
            "dietDesc": animal.dietDesc,
            "routineDesc": animal.routineDesc,
            "extraNotes": animal.extraNotes,
            "speciesId": animal.speciesId,
            "enclosureId": animal.enclosureId === 0 ? null : animal.enclosureId
        })
    });
    return res.json();
};

export const useCreateAnimal = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (animal: Animal) => createAnimal(token!, animal),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals", { user: user?.userId }] });
        }
    });
};

interface UpdateAnimalPayload {
    animalId: number;
    animalName: string;
    speciesId: number;
    enclosureId: number | null;
    image: string;
    gender: string;
    dob: string; // ISO 8601 date string
    personalityDesc: string;
    dietDesc: string;
    routineDesc: string;
    extraNotes: string;
}

export const updateAnimal = async (token: string, payload: UpdateAnimalPayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/animal`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update animal: ${res.status} - ${errorText}`);
    }
    
    // Returns 204 No Content on success
    return;
};

export const useUpdateAnimal = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (payload: UpdateAnimalPayload) => updateAnimal(token!, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals", { user: user?.userId }] });
        }
    });
};

export const deleteAnimal = async (token: string, animalId: number): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/animal/withtasks`, {
        method: "DELETE",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ animalId })
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Failed to delete animal: ${error.error || res.statusText}`);
    }
    
    // Success - returns 204 No Content
    return;
};

export const useDeleteAnimal = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (animalId: number) => deleteAnimal(token!, animalId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals", { user: user?.userId }] });
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};

interface MemorializeAnimalPayload {
    animalId: number;
    lastMessage: string;
}

export const memorializeAnimal = async (token: string, payload: MemorializeAnimalPayload) => {
    // First, fetch the current animal data to get all required fields
    const animals = await fetchAnimals(token);
    const animal = animals.find((a: Animal) => a.animalId === payload.animalId);
    
    if (!animal) {
        throw new Error(`Animal with id ${payload.animalId} not found`);
    }
    
    // Create update payload with all required fields plus memorial fields
    const updatePayload: UpdateAnimalPayload = {
        animalId: animal.animalId,
        animalName: animal.animalName,
        speciesId: animal.speciesId,
        enclosureId: animal.enclosureId === 0 ? null : animal.enclosureId,
        image: animal.image,
        gender: animal.gender,
        dob: animal.dob,
        personalityDesc: animal.personalityDesc,
        dietDesc: animal.dietDesc,
        routineDesc: animal.routineDesc,
        extraNotes: animal.extraNotes
    };
    
    // Get current date in ISO 8601 format (YYYY-MM-DD) using local timezone
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    
    // Add memorial fields to the payload
    const memorialPayload = {
        ...updatePayload,
        isMemorialized: true,
        lastMessage: payload.lastMessage,
        memorialDate: currentDate
    };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/animal`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(memorialPayload)
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to memorialize animal: ${res.status} - ${errorText}`);
    }
    
    // Returns 204 No Content on success
    return;
};

export const useMemorializeAnimal = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (payload: MemorializeAnimalPayload) => memorializeAnimal(token!, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["animals", { user: user?.userId }] });
        }
    });
};