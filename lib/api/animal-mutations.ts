import { Animal } from "@/types/db-types";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";

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