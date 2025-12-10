import { Enclosure } from "@/types/db-types";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";

export const createEnclosure = async (token: string, enclosure: Enclosure) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/enclosure`, {
        method: "POST",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "enclosureName": enclosure.enclosureName,
            "image": enclosure.image,
            "notes": enclosure.notes,
            "habitatId": enclosure.habitatId
        })
    });
    return res.json();
};

export const useCreateEnclosure = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (enclosure: Enclosure) => createEnclosure(token!, enclosure),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["enclosures", { user: user?.userId }] });
        }
    });
};

interface UpdateEnclosurePayload {
    enclosureId: number;
    enclosureName: string;
    habitatId: number;
    image?: string;
    notes?: string;
}

export const updateEnclosure = async (token: string, payload: UpdateEnclosurePayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/enclosure`, {
        method: "PUT",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update enclosure');
    }
    
    // Returns 204 No Content on success
    return;
};

export const useUpdateEnclosure = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (payload: UpdateEnclosurePayload) => updateEnclosure(token!, payload),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["enclosures", { user: user?.userId }] });
        }
    });
};

export const deleteEnclosure = async (token: string, enclosureId: number): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/enclosure/id/withtasks`, {
        method: "DELETE",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ enclosureId })
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Failed to delete enclosure: ${error.error || res.statusText}`);
    }
    
    // Success - returns 204 No Content
    return;
};

export const useDeleteEnclosure = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (enclosureId: number) => deleteEnclosure(token!, enclosureId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["enclosures", { user: user?.userId }] });
        }
    });
};

export const deleteEnclosureWithAnimals = async (token: string, enclosureId: number): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/enclosure/id/withanimalsandtasks`, {
        method: "DELETE",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ enclosureId })
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Failed to delete enclosure with animals: ${error.error || res.statusText}`);
    }
    
    // Success - returns 204 No Content
    return;
};

export const useDeleteEnclosureWithAnimals = () => {
    const { user, token } = useAuth();
    const queryClient = getQueryClient();
    
    return useMutation({
        mutationFn: (enclosureId: number) => deleteEnclosureWithAnimals(token!, enclosureId),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["enclosures", { user: user?.userId }] });
            queryClient.invalidateQueries({ queryKey: ["animals", { user: user?.userId }] });
            queryClient.invalidateQueries({ queryKey: ["tasks", { user: user?.userId }] });
        }
    });
};