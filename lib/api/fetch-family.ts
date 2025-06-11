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
    const { token } = useAuth();
    return useQuery({ 
        queryKey: ["animals", { token }], 
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
    const { token } = useAuth();
    return useQuery({ 
        queryKey: ["enclosures", { token }], 
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
    const { token } = useAuth();
    return useQuery({ 
        queryKey: ["tasks", { token }], 
        queryFn: () => fetchTasks(token!), 
        enabled: !!token 
    });
};