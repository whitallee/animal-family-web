/**
 * The application's entity types, re-exported from the generated API client.
 *
 * These were previously hand-written to mirror the backend's Go structs, which
 * meant nothing enforced that they matched. They had drifted: `User` declared a
 * `userId` field the API has never returned (it sends `id`), so `user.userId`
 * evaluated to undefined everywhere it was read, and `Animal.enclosureId` was
 * typed as a plain number when the API can and does return null for an animal
 * that is not in an enclosure.
 *
 * Re-exporting from `lib/api/generated/model` means the definitions come from
 * the backend's OpenAPI contract. A backend change that alters a response now
 * shows up as a type error here rather than as a runtime surprise.
 *
 * Do not add fields to these types. If a shape needs to change, change it in
 * the backend and regenerate; if the app needs a shape the API does not
 * describe, put it in subject-types.ts.
 */
export type {
  AnimalResponse as Animal,
  Enclosure,
  Habitat,
  Species,
  // Tasks always arrive with the subject they belong to, both from the
  // collection and from GET /tasks/{id}.
  TaskWithSubject as Task,
  UserResponse as User,
} from "@/lib/api/generated/model";
