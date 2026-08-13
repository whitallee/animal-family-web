/**
 * End-to-end check that the generated client can actually talk to a running
 * backend: real URLs, real base path, real response parsing.
 *
 * Typechecking proves the generated code is internally consistent; this proves
 * the contract matches what the server serves.
 *
 * Usage: start the backend, then
 *   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 npx tsx scripts/smoke-generated-client.ts
 */
import {
  createHabitat,
  listHabitats,
} from "../lib/api/generated/habitats/habitats";
import { listSpecies } from "../lib/api/generated/species/species";
import type { Habitat, Species } from "../lib/api/generated/model";
import { ApiError } from "../lib/api/fetcher";

/**
 * Narrows the generated response envelope to its success branch.
 *
 * The envelope is a union over every documented status, so `data` types as
 * `Habitat[] | ErrorResponse` even though apiFetch throws on non-2xx and the
 * error branch is unreachable. Narrowing on `status` is what makes the payload
 * usable — the lib/api wrappers will do exactly this.
 */
function ok<T>(response: { status: number; data: T | unknown }): T {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`expected a 2xx response, got ${response.status}`);
  }
  return response.data as T;
}

async function main() {
  const habitatsResponse = await listHabitats();
  const habitats = ok<Habitat[]>(habitatsResponse);
  console.log(
    `listHabitats  -> status ${habitatsResponse.status}, ${habitats.length} habitats, first: ${habitats[0]?.habitatName}`,
  );

  const speciesResponse = await listSpecies();
  const species = ok<Species[]>(speciesResponse);
  console.log(
    `listSpecies   -> status ${speciesResponse.status}, ${species.length} species, first: ${species[0]?.comName}`,
  );

  // An admin route with no token must reject, proving errors surface as a
  // thrown ApiError rather than resolving as if successful (the bug in the
  // hand-written client, where half the calls never checked res.ok).
  try {
    await createHabitat({
      habitatName: "smoke-test-should-never-be-created",
      habitatDesc: "d",
      image: "i",
      humidity: "h",
      dayTempRange: "d",
      nightTempRange: "n",
    });
    throw new Error("FAIL: unauthenticated createHabitat resolved successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(
        `createHabitat -> correctly rejected: ${error.status} "${error.message}"`,
      );
    } else {
      throw error;
    }
  }
}

main()
  .then(() => console.log("\nAll checks passed."))
  .catch((error) => {
    console.error("\nFAILED:", error);
    process.exit(1);
  });
