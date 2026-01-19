"use client";

import { useState, useEffect, useCallback } from "react";
import { useVapidKey, useSubscribeToPush, useUnsubscribeFromPush } from "@/lib/api/notification-mutations";

// Helper to convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function useNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [permission, setPermission] = useState<NotificationPermission>("default");

    const { data: vapidData } = useVapidKey();
    const subscribeMutation = useSubscribeToPush();
    const unsubscribeMutation = useUnsubscribeFromPush();

    // Check if push notifications are supported
    useEffect(() => {
        const supported =
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window;
        setIsSupported(supported);

        if (supported) {
            setPermission(Notification.permission);
            checkSubscriptionStatus();
        }
    }, []);

    // Check if user is already subscribed
    const checkSubscriptionStatus = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error('Error checking subscription status:', error);
            setIsSubscribed(false);
        }
    };

    // Subscribe to push notifications
    const subscribe = useCallback(async () => {
        if (!isSupported || !vapidData?.publicKey) {
            throw new Error('Push notifications not supported or VAPID key not available');
        }

        try {
            // Request notification permission
            const permissionResult = await Notification.requestPermission();
            setPermission(permissionResult);

            if (permissionResult !== 'granted') {
                throw new Error('Notification permission denied');
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey)
            });

            // Send subscription to backend
            const subscriptionJson = subscription.toJSON();
            await subscribeMutation.mutateAsync({
                endpoint: subscriptionJson.endpoint!,
                keys: {
                    p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
                    auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
                }
            });

            setIsSubscribed(true);
            return subscription;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            throw error;
        }
    }, [isSupported, vapidData, subscribeMutation]);

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Notify backend first
                await unsubscribeMutation.mutateAsync({
                    endpoint: subscription.endpoint
                });

                // Then unsubscribe locally
                await subscription.unsubscribe();
            }

            setIsSubscribed(false);
        } catch (error) {
            console.error('Error unsubscribing from push notifications:', error);
            throw error;
        }
    }, [unsubscribeMutation]);

    return {
        isSupported,
        isSubscribed,
        permission,
        subscribe,
        unsubscribe,
        isLoading: subscribeMutation.isPending || unsubscribeMutation.isPending,
    };
}
