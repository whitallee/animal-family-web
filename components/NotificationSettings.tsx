"use client";

import { useNotifications } from "@/lib/useNotifications";
import { Button } from "@/components/ui/button";
import { BellIcon, BellOffIcon } from "lucide-react";
import { useState } from "react";

export default function NotificationSettings() {
    const { isSupported, isSubscribed, permission, subscribe, unsubscribe, isLoading } = useNotifications();
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async () => {
        setError(null);
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    if (!isSupported) {
        return (
            <div className="p-3 bg-stone-600 rounded-md">
                <p className="text-sm text-stone-300">Push notifications are not supported in this browser.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 bg-stone-600 rounded-md">
                <div className="flex items-center gap-2">
                    {isSubscribed ? <BellIcon className="w-5 h-5" /> : <BellOffIcon className="w-5 h-5" />}
                    <span className="text-sm font-medium">Push Notifications</span>
                </div>
                <Button
                    size="sm"
                    variant={isSubscribed ? "destructive" : "default"}
                    onClick={handleToggle}
                    disabled={isLoading || permission === "denied"}
                >
                    {isLoading ? "..." : isSubscribed ? "Disable" : "Enable"}
                </Button>
            </div>

            {permission === "denied" && (
                <p className="text-xs text-stone-400">
                    Notifications are blocked. Please enable them in your browser settings.
                </p>
            )}

            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}

            {isSubscribed && (
                <p className="text-xs text-stone-400">
                    You&apos;ll receive notifications for upcoming tasks.
                </p>
            )}
        </div>
    );
}
