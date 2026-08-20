import { useQuery } from "@tanstack/react-query";
import { listSpecies } from "@/lib/api/generated/species/species";
import { listHabitats } from "@/lib/api/generated/habitats/habitats";
import type { Species, Habitat } from "@/lib/api/generated/model";
import { queryKeys } from "./keys";
import { unwrap } from "./unwrap";

/**
 * Reference data: global, public, and effectively static.
 *
 * Cached for a week because species and habitats only change when an admin adds
 * one, and kept indefinitely so navigating away does not force a refetch.
 */
const REFERENCE_DATA_STALE_TIME = 7 * 24 * 60 * 60 * 1000;

export function useSpecies() {
  return useQuery({
    queryKey: queryKeys.species(),
    queryFn: async () => unwrap<Species[]>(await listSpecies()),
    staleTime: REFERENCE_DATA_STALE_TIME,
    gcTime: Infinity,
  });
}

export function useHabitats() {
  return useQuery({
    queryKey: queryKeys.habitats(),
    queryFn: async () => unwrap<Habitat[]>(await listHabitats()),
    staleTime: REFERENCE_DATA_STALE_TIME,
    gcTime: Infinity,
  });
}
