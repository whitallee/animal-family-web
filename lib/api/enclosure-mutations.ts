import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";
import {
  createEnclosure as createEnclosureRequest,
  deleteEnclosure as deleteEnclosureRequest,
  updateEnclosure as updateEnclosureRequest,
} from "@/lib/api/generated/enclosures/enclosures";
import { queryKeys } from "./keys";

export interface CreateEnclosureInput {
  enclosureName: string;
  habitatId: number;
  // Optional on the API: a blank image or note is simply absent.
  image?: string;
  notes?: string;
}

export interface UpdateEnclosureInput extends CreateEnclosureInput {
  enclosureId: number;
}

export const useCreateEnclosure = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (enclosure: CreateEnclosureInput) =>
      createEnclosureRequest({
        enclosureName: enclosure.enclosureName,
        habitatId: enclosure.habitatId,
        image: enclosure.image,
        notes: enclosure.notes,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enclosures(user?.id) });
    },
  });
};

export const useUpdateEnclosure = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ enclosureId, ...enclosure }: UpdateEnclosureInput) =>
      updateEnclosureRequest(enclosureId, {
        enclosureName: enclosure.enclosureName,
        habitatId: enclosure.habitatId,
        image: enclosure.image,
        notes: enclosure.notes,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enclosures(user?.id) });
    },
  });
};

/**
 * Removes the enclosure and its tasks, leaving its animals without one.
 *
 * v1 spelled this /enclosure/id/withtasks; v2 expresses the same thing as a
 * cascade parameter on the one delete route.
 */
export const useDeleteEnclosure = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (enclosureId: number) =>
      deleteEnclosureRequest(enclosureId, { cascade: "tasks" }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enclosures(user?.id) });
      // The enclosure's animals survive but their enclosureId changes, so the
      // animal list is stale too.
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};

/** Removes the enclosure along with its animals and all of their tasks. */
export const useDeleteEnclosureWithAnimals = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (enclosureId: number) =>
      deleteEnclosureRequest(enclosureId, { cascade: "animals" }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enclosures(user?.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};
