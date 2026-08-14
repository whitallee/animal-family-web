import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";


// Animals
export const fetchAnimals = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/animal`, {
        method: "GET",
        headers: {
            "Authorization": `${token}`
        }
    });
    return res.json();
};

export const useAnimals = () => {
    const { token, user } = useAuth();
    return useQuery({
        // Must match the key the animal mutations invalidate. Keying on the
        // token instead meant every ["animals", { user }] invalidation silently
        // matched nothing, so the list only refreshed once staleTime expired.
        queryKey: ["animals", { user: user?.userId }],
        queryFn: () => fetchAnimals(token!),
        enabled: !!token
    });
};

// Enclosures
export const fetchEnclosures = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/enclosure`, {
        method: "GET",
        headers: {
            "Authorization": `${token}`
        }
    });
    return res.json();
};

export const useEnclosures = () => {
    const { token, user } = useAuth();
    return useQuery({
        // See the note on useAnimals: this must match the key the enclosure
        // mutations invalidate.
        queryKey: ["enclosures", { user: user?.userId }],
        queryFn: () => fetchEnclosures(token!),
        enabled: !!token
    });
};

// Tasks
export const fetchTasks = async (token: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/task`, {
        method: "GET",
        headers: {
            "Authorization": `${token}`
        }
    });
    
    return res.json();
};

export const useTasks = () => {
    const { user, token } = useAuth();
    return useQuery({ 
        queryKey: ["tasks", { user: user?.userId }], 
        queryFn: () => fetchTasks(token!), 
        enabled: !!token 
    });
};