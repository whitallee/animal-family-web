import { useQuery } from '@tanstack/react-query';
import { Species, Habitat } from '@/types/db-types';

async function fetchSpecies(): Promise<Species[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/species`);
  if (!response.ok) {
    throw new Error('Failed to fetch species');
  }
  return response.json();
}

async function fetchHabitats(): Promise<Habitat[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/habitat`);
  if (!response.ok) {
    throw new Error('Failed to fetch habitats');
  }
  return response.json();
}

export function useSpecies() {
  return useQuery({
    queryKey: ['species'],
    queryFn: fetchSpecies,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    gcTime: Infinity,
  });
}

export function useHabitats() {
  return useQuery({
    queryKey: ['habitats'],
    queryFn: fetchHabitats,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    gcTime: Infinity,
  });
}
