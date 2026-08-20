/**
 * End-to-end check that the generated client can talk to a running backend:
 * real URLs, real base path, real auth, real response parsing.
 *
 * Typechecking proves the generated code is internally consistent; this proves
 * the contract matches what the server actually serves.
 *
 * Read-only by default. Pass credentials to exercise the authenticated reads:
 *   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 \
 *   SMOKE_EMAIL=you@example.com SMOKE_PASSWORD=... \
 *   npx tsx scripts/smoke-generated-client.ts
 */
import { createHabitat, listHabitats } from "../lib/api/generated/habitats/habitats";
import { listSpecies } from "../lib/api/generated/species/species";
import { listAnimals } from "../lib/api/generated/animals/animals";
import { listEnclosures } from "../lib/api/generated/enclosures/enclosures";
import { listTasks } from "../lib/api/generated/tasks/tasks";
import { getCurrentUser, loginUser } from "../lib/api/generated/users/users";
import type {
  AnimalResponse,
  AuthResponse,
  Enclosure,
  Habitat,
  Species,
  TaskWithSubject,
  UserResponse,
} from "../lib/api/generated/model";
import { ApiError } from "../lib/api/fetcher";
import { unwrap } from "../lib/api/unwrap";

// The client reads the token from localStorage, which does not exist here.
const store = new Map<string, string>();
(globalThis as { window?: unknown }).window = {
  localStorage: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  },
};

async function publicChecks() {
  const habitats = unwrap<Habitat[]>(await listHabitats());
  console.log(`listHabitats   -> ${habitats.length} habitats, first: ${habitats[0]?.habitatName}`);

  const species = unwrap<Species[]>(await listSpecies());
  console.log(`listSpecies    -> ${species.length} species, first: ${species[0]?.comName}`);

  // An admin route with no token must reject, proving failures surface as a
  // thrown ApiError rather than resolving as though they had succeeded.
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
    if (!(error instanceof ApiError)) throw error;
    console.log(`createHabitat  -> correctly rejected: ${error.status} "${error.message}"`);
  }
}

async function authenticatedChecks(email: string, password: string) {
  const auth = unwrap<AuthResponse>(await loginUser({ email, password }));
  store.set("auth_token", auth.token);
  console.log(`\nloginUser      -> signed in as ${auth.user.email} (id ${auth.user.id})`);

  // The field the old hand-written User type got wrong: it declared userId,
  // the API has always sent id.
  if (typeof auth.user.id !== "number") {
    throw new Error(`FAIL: expected a numeric user id, got ${JSON.stringify(auth.user.id)}`);
  }
  // phone shipped as {String,Valid} before UserResponse existed.
  if (auth.user.phone !== null && typeof auth.user.phone !== "string") {
    throw new Error(`FAIL: phone should be a string or null, got ${JSON.stringify(auth.user.phone)}`);
  }

  const me = unwrap<UserResponse>(await getCurrentUser());
  console.log(`getCurrentUser -> ${me.firstName} ${me.lastName}, phone: ${JSON.stringify(me.phone)}`);

  const animals = unwrap<AnimalResponse[]>(await listAnimals());
  console.log(`listAnimals    -> ${animals.length} animals, first: ${animals[0]?.animalName}`);

  const enclosures = unwrap<Enclosure[]>(await listEnclosures());
  console.log(`listEnclosures -> ${enclosures.length} enclosures`);

  const tasks = unwrap<TaskWithSubject[]>(await listTasks());
  console.log(`listTasks      -> ${tasks.length} tasks`);

  // Every task must report the subject that PUT /tasks/{id} requires back.
  const withoutSubject = tasks.filter((t) => t.animalId == null && t.enclosureId == null);
  if (withoutSubject.length > 0) {
    throw new Error(`FAIL: ${withoutSubject.length} task(s) came back with no subject`);
  }
  console.log(`               -> all ${tasks.length} carry a subject, so updates can round-trip`);
}

async function main() {
  await publicChecks();

  const email = process.env.SMOKE_EMAIL;
  const password = process.env.SMOKE_PASSWORD;

  if (!email || !password) {
    console.log("\nSet SMOKE_EMAIL and SMOKE_PASSWORD to also check the authenticated routes.");
    return;
  }

  await authenticatedChecks(email, password);
}

main()
  .then(() => console.log("\nAll checks passed."))
  .catch((error) => {
    console.error("\nFAILED:", error);
    process.exit(1);
  });
