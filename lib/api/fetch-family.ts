import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { listAnimals } from "@/lib/api/generated/animals/animals";
import { listEnclosures } from "@/lib/api/generated/enclosures/enclosures";
import { listTasks } from "@/lib/api/generated/tasks/tasks";
import type {
  AnimalResponse,
  Enclosure,
  TaskWithSubject,
} from "@/lib/api/generated/model";
import { queryKeys } from "./keys";
import { unwrap } from "./unwrap";

/**
 * Read hooks for the family data.
 *
 * These wrap the generated v2 client rather than calling fetch directly. The
 * hook names and return shapes are unchanged so the components consuming them
 * did not have to change; what has changed is that the request, its URL and the
 * shape of what comes back are all derived from the backend's OpenAPI contract
 * instead of being retyped by hand.
 *
 * Authentication is applied by the mutator in ./fetcher.ts, so no token is
 * threaded through here.
 */

export const useAnimals = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.animals(user?.id),
    queryFn: async () => unwrap<AnimalResponse[]>(await listAnimals()),
    enabled: !!token,
  });
};

export const useEnclosures = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.enclosures(user?.id),
    queryFn: async () => unwrap<Enclosure[]>(await listEnclosures()),
    enabled: !!token,
  });
};

export const useTasks = () => {
  const { token, user } = useAuth();

  return useQuery({
    queryKey: queryKeys.tasks(user?.id),
    queryFn: async () => unwrap<TaskWithSubject[]>(await listTasks()),
    enabled: !!token,
  });
};
