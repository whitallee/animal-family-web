import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getVapidPublicKey,
  subscribeToPush as subscribeToPushRequest,
  unsubscribeFromPush as unsubscribeFromPushRequest,
} from "@/lib/api/generated/notifications/notifications";
import type {
  SubscribePayload,
  UnsubscribePayload,
  VAPIDKeyResponse,
} from "@/lib/api/generated/model";
import { queryKeys } from "./keys";
import { unwrap } from "./unwrap";

/**
 * Web push registration over the generated v2 client.
 *
 * The request shapes come straight from the contract now, which matters here
 * because the subscription body is nested (`keys.p256dh`, `keys.auth`) and was
 * previously retyped by hand on this side.
 */

export const useVapidKey = () => {
  return useQuery({
    queryKey: queryKeys.vapidKey(),
    queryFn: async () => unwrap<VAPIDKeyResponse>(await getVapidPublicKey()),
    // The key is a deployment constant; refetching it would never return
    // anything different.
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useSubscribeToPush = () => {
  return useMutation({
    mutationFn: (payload: SubscribePayload) => subscribeToPushRequest(payload),
  });
};

export const useUnsubscribeFromPush = () => {
  return useMutation({
    mutationFn: (payload: UnsubscribePayload) => unsubscribeFromPushRequest(payload),
  });
};
