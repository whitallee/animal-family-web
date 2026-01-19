import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../AuthContext";
import { getQueryClient } from "@/lib/get-query-client";

// Fetch VAPID public key
export const fetchVapidPublicKey = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notification/vapid-public-key`);
    if (!res.ok) {
        throw new Error('Failed to fetch VAPID key');
    }
    return res.json(); // { publicKey: string }
};

export const useVapidKey = () => {
    return useQuery({
        queryKey: ["vapidKey"],
        queryFn: fetchVapidPublicKey,
        staleTime: Infinity, // VAPID key doesn't change
    });
};

// Subscribe to push notifications
interface SubscribePayload {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export const subscribeToPush = async (token: string, payload: SubscribePayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notification/subscribe`, {
        method: "POST",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to subscribe' }));
        throw new Error(error.error || error.message || 'Failed to subscribe to notifications');
    }

    return res.json();
};

export const useSubscribeToPush = () => {
    const { token } = useAuth();
    const queryClient = getQueryClient();

    return useMutation({
        mutationFn: (payload: SubscribePayload) => subscribeToPush(token!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificationStatus"] });
        }
    });
};

// Unsubscribe from push notifications
interface UnsubscribePayload {
    endpoint: string;
}

export const unsubscribeFromPush = async (token: string, payload: UnsubscribePayload) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/notification/unsubscribe`, {
        method: "POST",
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Failed to unsubscribe' }));
        throw new Error(error.error || error.message || 'Failed to unsubscribe from notifications');
    }

    return res.json();
};

export const useUnsubscribeFromPush = () => {
    const { token } = useAuth();
    const queryClient = getQueryClient();

    return useMutation({
        mutationFn: (payload: UnsubscribePayload) => unsubscribeFromPush(token!, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificationStatus"] });
        }
    });
};
