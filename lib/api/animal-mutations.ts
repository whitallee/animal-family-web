import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { getQueryClient } from "@/lib/get-query-client";
import {
  createAnimal as createAnimalRequest,
  deleteAnimal as deleteAnimalRequest,
  setAnimalMemorial,
  updateAnimal as updateAnimalRequest,
} from "@/lib/api/generated/animals/animals";
import { queryKeys } from "./keys";

/**
 * Animal mutations over the generated v2 client.
 *
 * Hook names and argument shapes match what the components already pass, so
 * this migration did not ripple outwards. The request bodies are now typed by
 * the backend's contract, which is what stops the two repos drifting apart.
 */

/** The subset of an animal the create form collects. */
export interface CreateAnimalInput {
  animalName: string;
  speciesId: number;
  enclosureId: number | null;
  image: string;
  gender: string;
  dob: string;
  personalityDesc: string;
  dietDesc: string;
  routineDesc: string;
  extraNotes: string;
}

export interface UpdateAnimalInput extends CreateAnimalInput {
  animalId: number;
}

export interface MemorializeAnimalInput {
  animalId: number;
  lastMessage: string;
}

/**
 * v1 used 0 to mean "no enclosure" in places while the API expects null.
 * Normalising here keeps that quirk from reaching the request body.
 */
function enclosureIdOrNull(enclosureId: number | null | undefined): number | null {
  if (enclosureId === null || enclosureId === undefined || enclosureId === 0) {
    return null;
  }

  return enclosureId;
}

export const useCreateAnimal = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: (animal: CreateAnimalInput) =>
      createAnimalRequest({
        animalName: animal.animalName,
        speciesId: animal.speciesId,
        enclosureId: enclosureIdOrNull(animal.enclosureId),
        image: animal.image,
        gender: animal.gender,
        dob: animal.dob,
        personalityDesc: animal.personalityDesc,
        dietDesc: animal.dietDesc,
        routineDesc: animal.routineDesc,
        extraNotes: animal.extraNotes,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
    },
  });
};

export const useUpdateAnimal = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ animalId, ...animal }: UpdateAnimalInput) =>
      updateAnimalRequest(animalId, {
        animalName: animal.animalName,
        speciesId: animal.speciesId,
        enclosureId: enclosureIdOrNull(animal.enclosureId),
        image: animal.image,
        gender: animal.gender,
        dob: animal.dob,
        personalityDesc: animal.personalityDesc,
        dietDesc: animal.dietDesc,
        routineDesc: animal.routineDesc,
        extraNotes: animal.extraNotes,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
    },
  });
};

export const useDeleteAnimal = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    // Tasks belonging to the animal go with it, matching what v1's
    // /animal/withtasks route did.
    mutationFn: (animalId: number) => deleteAnimalRequest(animalId, { cascade: "tasks" }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks(user?.id) });
    },
  });
};

/**
 * Memorialising is now a single request to a dedicated endpoint.
 *
 * It previously had to fetch every animal the user owns, find the one being
 * memorialised and rebuild a complete update payload, because memorial state
 * was mixed in with the animal's editable fields and the update replaced all of
 * them. Splitting memorial state onto its own route removed that entirely.
 */
export const useMemorializeAnimal = () => {
  const { user } = useAuth();
  const queryClient = getQueryClient();

  return useMutation({
    mutationFn: ({ animalId, lastMessage }: MemorializeAnimalInput) =>
      setAnimalMemorial(animalId, {
        lastMessage,
        memorialDate: localDateString(),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.animals(user?.id) });
    },
  });
};

/**
 * Today's date in the user's own timezone, as YYYY-MM-DD.
 *
 * toISOString() would convert to UTC first, which puts the memorial on the
 * wrong day for anyone west of Greenwich during their evening.
 */
function localDateString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}
