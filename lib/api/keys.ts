/**
 * Query keys, defined once.
 *
 * Every query and every invalidation must derive its key from here. Writing the
 * key out by hand at each site is what let `useAnimals` key on `{ token }` while
 * its mutations invalidated `{ user }` — TanStack matches keys by partial deep
 * equality, so those invalidations silently matched nothing and the list only
 * refreshed once staleTime expired. That surfaced as "the home screen needs a
 * refresh after deleting an enclosure".
 *
 * Keys are scoped by user id so that logging in as somebody else cannot show the
 * previous account's cached data.
 */
export const queryKeys = {
  animals: (userId?: number) => ["animals", { user: userId }] as const,
  enclosures: (userId?: number) => ["enclosures", { user: userId }] as const,
  tasks: (userId?: number) => ["tasks", { user: userId }] as const,
  species: () => ["species"] as const,
  habitats: () => ["habitats"] as const,
  vapidKey: () => ["vapidKey"] as const,
};
