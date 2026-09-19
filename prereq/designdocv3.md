# AI Short Story Co-Writer with Plot Branching

## New implementation plan

This is a greenfield implementation plan. No existing repository is assumed. The implementer must create a complete, production-shaped application rather than a UI-only prototype.

## 1. Product outcome

The user enters a title, fixed genre, tone, and premise. The system persists the story, generates an opening scene, and presents two or three plot choices. Each selected unexplored choice creates one immutable child scene and another set of choices. The writer can move backward through the tree, create alternative branches without deleting earlier work, store a complete immutable snapshot, reopen it with the original genre theme, fork it for further writing, and export only the currently active linear path.

### Non-negotiable behaviors

- The database is authoritative for stories, scenes, choices, active scene, and stored snapshots.
- A ready scene is immutable.
- A choice can create at most one child scene in v1.
- Clicking an explored choice opens its existing child and never invokes the AI.
- Clicking a prior scene changes navigation only; it never deletes descendants.
- New generation context is root-to-source ancestry only; siblings and descendants are excluded.
- The complete tree is retained independently of the active path.
- `activeSceneId` is the only persisted current-position field; the active path is derived.
- Store creates an immutable complete-tree snapshot; it never collapses a story to one path.
- Continuing a stored snapshot forks a new editable working story; the source snapshot remains unchanged.
- Export contains prose from root through the active scene only.

## 2. Fixed technical architecture

Use a pnpm TypeScript monorepo:

```text
ai-story-cowriter/
├─ apps/api/                 # Express API, Prisma, generation, export
├─ apps/web/                 # React/Vite workspace and library UI
├─ packages/shared/          # Zod contracts, IDs, enums, DTOs
├─ docs/                     # architecture, prompts, API, demo guide
├─ package.json
└─ pnpm-workspace.yaml
```

Use React, Vite, TypeScript, React Router, and TanStack Query in the web app. Use Node.js, Express, Prisma, and Zod in the API. Use SQLite for local development and PostgreSQL-compatible migrations for deployment. Put OpenAI behind a `StoryGenerationProvider` interface and ship a deterministic mock provider for tests and demos. Use PDFKit for server-generated PDF output.

## 3. File structure and responsibilities

```text
apps/api/
├─ prisma/schema.prisma
├─ src/
│  ├─ app.ts                    # Express middleware and route registration
│  ├─ server.ts                 # startup, env loading, HTTP listener
│  ├─ config/env.ts             # validated environment variables
│  ├─ routes/
│  │  ├─ story.routes.ts        # working-story endpoints
│  │  ├─ snapshot.routes.ts     # library, view, store, fork endpoints
│  │  └─ export.routes.ts       # Markdown/PDF response wiring
│  ├─ controllers/
│  │  ├─ story.controller.ts    # request parsing and service invocation
│  │  ├─ snapshot.controller.ts # snapshot lifecycle HTTP behavior
│  │  └─ export.controller.ts   # content type and download headers
│  ├─ services/
│  │  ├─ story.service.ts       # create/read/activate working stories
│  │  ├─ generation.service.ts  # reservation, provider, validation, persistence
│  │  ├─ context.service.ts     # ancestry-only context reconstruction
│  │  ├─ snapshot.service.ts    # full-tree snapshot and fork operations
│  │  ├─ export.service.ts      # active path compilation and document rendering
│  │  └─ tree.service.ts        # DTO assembly and relationship checks
│  ├─ providers/
│  │  ├─ story-generation.ts    # provider interface
│  │  ├─ openai.provider.ts     # Responses API implementation
│  │  └─ mock.provider.ts       # deterministic branching fixtures
│  ├─ prompts/
│  │  ├─ system.ts
│  │  ├─ opening.ts
│  │  ├─ continuation.ts
│  │  └─ repair.ts
│  ├─ validators/
│  │  ├─ request.schemas.ts     # HTTP input validation
│  │  └─ generated.schemas.ts   # AI output validation
│  ├─ middleware/
│  │  ├─ error-handler.ts       # stable API errors, hidden stack traces
│  │  ├─ request-id.ts
│  │  └─ rate-limit.ts
│  └─ utils/
│     ├─ filename.ts
│     └─ path.ts
└─ tests/
   ├─ unit/
   ├─ integration/
   └─ fixtures/

apps/web/src/
├─ api/client.ts                # typed fetch and API error normalization
├─ api/stories.api.ts           # working story calls
├─ api/snapshots.api.ts         # library/view/fork calls
├─ config/genres.ts             # client-side GenreConfig registry
├─ theme/GenreThemeProvider.tsx # CSS variables from stored genre
├─ pages/
│  ├─ StoryLibraryPage.tsx
│  ├─ NewStoryPage.tsx
│  ├─ StoryWorkspacePage.tsx
│  └─ SnapshotViewerPage.tsx
├─ components/
│  ├─ StoryHeader.tsx
│  ├─ StoryTree.tsx
│  ├─ StoryTreeNode.tsx
│  ├─ SceneReader.tsx
│  ├─ ChoiceList.tsx
│  ├─ ChoiceButton.tsx
│  ├─ CurrentPathBreadcrumb.tsx
│  ├─ GenerationState.tsx
│  ├─ ErrorPanel.tsx
│  ├─ ExportMenu.tsx
│  ├─ StoreStoryButton.tsx
│  └─ SnapshotCard.tsx
├─ features/stories/
│  ├─ hooks.ts                  # query and mutation hooks
│  ├─ tree.ts                   # pure tree lookup helpers
│  └─ active-path.ts            # pure display path helpers
└─ styles/
   ├─ tokens.css
   └─ workspace.css

packages/shared/src/
├─ genres.ts                    # fixed IDs, labels, guidance
├─ tones.ts
├─ schemas.ts                   # Zod request/response schemas
├─ types.ts                     # DTO and domain types
└─ index.ts
```

## 4. Fixed genre and theme system

Define exactly these stable IDs: `love`, `detective`, `horror`, `scifi`, `fantasy`, `adventure`, `comedy`, `historical`, `drama`, and `thriller`.

Each `GenreConfig` must contain:

```ts
type GenreConfig = {
  id: GenreId;
  displayName: string;
  description: string;
  icon: string;
  tokens: {
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    muted: string;
    accent: string;
    accentContrast: string;
    border: string;
  };
  typographyClass: string;
  motionClass?: string;
  aiGuidance: string;
};
```

Use distinct design language: rose/elegant for love, navy/noir for detective, eerie crimson for horror, cool cyan for sci-fi, purple/gold for fantasy, warm exploration colors for adventure, playful bright colors for comedy, parchment/vintage for historical, cinematic emotional styling for drama, and high-contrast tense styling for thriller. The registry is the only place that maps IDs to visual and AI guidance. Never scatter genre conditionals across components.

The selected `story.genre` from the API drives `GenreThemeProvider`, which sets CSS variables and classes. A refresh or snapshot reopen must re-read the genre from the server before rendering the workspace theme.

## 5. Database model

### Working story records

`Story`: `id`, `title`, `genre`, `tone`, `premise`, `status`, `rootSceneId`, `activeSceneId`, optional `sourceSnapshotId`, and timestamps.

`Scene`: `id`, `storyId`, nullable `parentChoiceId`, `depth`, `text`, `summary`, `status`, `generationError`, and timestamps.

`Choice`: `id`, `storyId`, `sourceSceneId`, nullable unique `childSceneId`, `ordinal`, `text`, `narrativeIntent`, `generationState`, and timestamp.

Required constraints:

- One root scene per story after opening generation.
- `Choice(sourceSceneId, ordinal)` unique.
- One child maximum per choice.
- Child scene has exactly one parent choice.
- Ready scenes cannot be updated by continuation logic.
- All story/scene/choice relationships are checked server-side.

### Immutable stored snapshots

Use `StorySnapshot` plus snapshot-local records:

- `StorySnapshot`: `id`, `sourceStoryId`, version, title, genre, tone, premise, snapshot root ID, snapshot active ID, status, created timestamp.
- `SnapshotScene`: immutable copy of every generated scene, with snapshot-local IDs and parent choice references.
- `SnapshotChoice`: immutable copy of every choice, with child references and ordinals.

`POST /api/stories/:storyId/store` must deep-copy every scene and choice in one transaction and preserve the active scene. It must not delete or alter the working story. Forking a snapshot deep-copies snapshot records into a new `Story`, `Scene`, and `Choice` tree with remapped IDs and `sourceSnapshotId` set.

## 6. API contracts

All contracts are defined in `packages/shared` and validated in both client and server.

### `POST /api/stories`

Request:

```json
{
  "title": "The Silent Room",
  "genre": "detective",
  "tone": "Mysterious",
  "premise": "A detective finds a coded message in an old library book."
}
```

Validate title 1–120 characters, genre against the fixed registry, tone against the controlled tone enum, and premise 20–2,000 characters. Create the story, generate the opening, persist root plus 2–3 choices, set `rootSceneId` and `activeSceneId`, and return `201` with the complete story DTO.

### `GET /api/stories/:storyId`

Return metadata, all scenes, all choices, active scene, and `activePathSceneIds`. Never return raw prompts or provider payloads.

### `POST /api/stories/:storyId/continue`

Request `{ "choiceId": "..." }`.

Server sequence:

1. Verify story and choice ownership.
2. If the choice has a child, update active scene and return the existing tree without an AI call.
3. Reserve the choice transactionally; concurrent requests receive the existing result or `409 GENERATION_IN_PROGRESS`.
4. Build root-to-source ancestry from the database.
5. Generate structured continuation and validate/repair once.
6. Persist exactly one child scene and 2–3 choices atomically.
7. Set the new child active and return the complete tree.

### `POST /api/stories/:storyId/active-scene`

Request `{ "sceneId": "..." }`. Validate scene ownership, update only `activeSceneId`, and return the refreshed tree. This operation never calls the AI and never deletes descendants.

### `POST /api/stories/:storyId/store`

Create a complete immutable snapshot. Return `{ snapshotId, version, storySummary }` with `201`.

### Snapshot endpoints

```text
GET  /api/snapshots
GET  /api/snapshots/:snapshotId
POST /api/snapshots/:snapshotId/fork
GET  /api/snapshots/:snapshotId/export?format=markdown|pdf
```

The list returns title, genre, tone, scene count, branch count, version, and stored time. Snapshot view returns the complete immutable tree and active path. Fork returns the new working story ID.

### Export endpoints

```text
GET /api/stories/:storyId/export?format=markdown|pdf
GET /api/snapshots/:snapshotId/export?format=markdown|pdf
```

Export only root-to-active scene prose. Exclude sibling branches, choices, IDs, `parentChoiceId`, `childSceneId`, `narrativeIntent`, prompts, and database metadata. Use safe `Content-Disposition` filenames and correct content types.

Stable errors: `VALIDATION_ERROR` (400), `NOT_FOUND` (404), `GENERATION_IN_PROGRESS` (409), `STORY_NOT_READY` (422), `RATE_LIMITED` (429), `GENERATION_PROVIDER_ERROR` (502), and `INTERNAL_ERROR` (500), each with a request ID.

## 7. AI generation contract

```ts
type GeneratedScene = {
  sceneText: string;
  sceneSummary: string;
  choices: Array<{ text: string; narrativeIntent: string }>;
};
```

Require approximately 300–500 prose words, a 40–100 word summary, and exactly two or three concise unique choices. Use structured model output. Include title, premise, genre guidance, tone, ancestry scenes, selected choices, and the newly selected choice. Do not send unrelated branches.

On invalid structured output, perform one repair request containing validation errors. If repair fails, preserve all prior database state, mark the reserved generation failed, and return a retryable error. The frontend must never construct or submit authoritative narrative context.

## 8. Frontend behavior and responsibilities

### Routes

- `/stories`: real persisted Generated Stories library.
- `/stories/new`: creation form and genre preview.
- `/stories/:storyId`: working story workspace.
- `/snapshots/:snapshotId`: immutable stored-story viewer.

### Creation page

Use required title, fixed genre select, fixed tone select, and multiline premise. `START WRITING` validates, submits, shows generation state, navigates directly to `/stories/:storyId`, and applies the selected genre theme as soon as the story response arrives.

### Workspace

`StoryHeader` shows title, genre, tone, premise indicator, library link, Store Story, and Export. `StoryTree` recursively renders every scene and choice. `StoryTreeNode` marks active scene, active ancestry, explored choices, unexplored choices, and endings. `SceneReader` displays prose and earlier-scene state. `ChoiceList` disables duplicate clicks and labels explored choices as “View branch” and unexplored choices as “Continue”. `CurrentPathBreadcrumb` is derived from API state. `ErrorPanel` offers Retry and Go Back while explaining that existing work is safe.

Clicking an old scene only calls active-scene. Selecting an unexplored choice calls continue. Selecting an explored choice changes active scene to its child without generation. A “Continue from here” affordance may focus the current scene’s choices but must not mutate the tree.

### Library and snapshot viewer

Each real snapshot card displays genre icon/accent, title, tone, scene count, branch count, version, stored time, Open, and Continue Exploring. Opening loads the complete snapshot and restores its theme. Continuing forks to a new working story; the original snapshot remains read-only.

## 9. Export implementation

`export.service.ts` derives the active path by walking parent relationships and reverses it into chronological order. Markdown contains a title, genre/tone metadata, and scene prose separated by clear breaks. PDFKit produces a title page, readable prose pages, margins, footer/page numbers, and no branch internals. Add tests that explicitly search output for forbidden IDs/prompts/choice labels.

## 10. Testing approach

Use Vitest for unit tests, Supertest for API integration tests, React Testing Library for components, and Playwright for the full browser flow. All automated generation tests use the deterministic mock provider; live OpenAI smoke tests are manual and optional.

### Unit tests

- Every fixed genre has a valid config, unique tokens, and AI guidance.
- Invalid genre and tone values are rejected.
- Active path returns root-to-active order and excludes siblings.
- Context builder includes ancestry and selected choices only.
- Recursive tree builder preserves choice order and unexplored leaves.
- Generated output rejects one/four choices, duplicate labels, empty fields, and invalid lengths.
- Existing choice path never calls provider.
- Generation reservation prevents a second child.
- Snapshot clone remaps all IDs and relationships without mutating source.
- Fork preserves full tree and active scene.
- Export includes only selected path and sanitizes filenames.

### API integration tests

1. Create story returns a persisted root and 2–3 choices.
2. Refresh/reload returns the same complete tree.
3. Continue an unexplored choice creates exactly one child.
4. Continue the same choice twice performs one provider call and one child.
5. Navigate backward preserves every descendant and branch count.
6. Create an alternative branch from an earlier scene; both branches remain.
7. Sibling content is absent from the continuation provider context.
8. Cross-story scene/choice IDs fail without mutations.
9. Concurrent continuation requests produce one child.
10. Store creates a full immutable snapshot, including active state.
11. Open snapshot restores all scenes, choices, counts, and genre.
12. Fork creates an independent working tree; further changes do not alter snapshot.
13. Markdown and PDF contain only root-to-active content.
14. Provider timeout and invalid output preserve existing content and permit retry.

### End-to-end acceptance flow

1. Open `/stories/new`.
2. Select Detective / Mystery and Mysterious tone.
3. Submit valid premise.
4. Verify navigation to `/stories/:storyId` and detective theme.
5. Generate branch A to depth three.
6. Navigate back to depth one; verify descendants remain.
7. Generate branch B; verify both branches are visible.
8. Click an explored choice; verify no new generation and no duplicate scene.
9. Store the story.
10. Return to `/stories`; open the stored snapshot.
11. Verify complete tree and detective theme restoration.
12. Fork and create another branch.
13. Verify the source snapshot remains unchanged.
14. Export the active path in Markdown and PDF.

## 11. Implementation phases

### Phase 1: foundation

Create monorepo, strict TypeScript, shared schemas, fixed genres/tones, Prisma models, migrations, seed fixtures, mock provider, and test setup.

### Phase 2: working-story backend

Implement create/read/continue/active-scene routes, ancestry context, structured generation validation, transactions, reservations, and error middleware.

### Phase 3: genre system and frontend shell

Implement GenreConfig, theme provider, CSS tokens, creation form, routing, query hooks, workspace layout, and responsive design.

### Phase 4: persistent tree UX

Implement recursive tree, reader, explored/unexplored choices, active path, rewind navigation, branch-from-earlier behavior, loading, retry, and accessibility states.

### Phase 5: snapshots and library

Implement deep-copy snapshots, library list, snapshot viewer, fork-to-working-story, restored themes, and real persisted counts.

### Phase 6: export and polish

Implement Markdown/PDF, forbidden-content checks, responsive/mobile layout, visual genre polish, keyboard navigation, screen-reader labels, and demo fixtures.

### Phase 7: verification

Run formatting, lint, type-check, unit tests, integration tests, production builds, database migration checks, and the complete browser acceptance flow. Record any remaining limitations explicitly.

## 12. Security and operational requirements

- Keep the AI key server-side.
- Validate every body, route parameter, genre, tone, format, scene ID, choice ID, and snapshot ID.
- Reject cross-story references.
- Limit request body size, premise size, story depth, and generation rate.
- Never render prose with unsafe HTML injection.
- Never return prompts, raw provider responses, internal IDs, or stack traces.
- Log request ID, safe error code, latency, and provider timing without logging full prose by default.
- Provide `.env.example`, health endpoint, database migration command, mock mode, and a seeded demo path.

## 13. Definition of done

The implementation is complete only when the full create → generate → branch → rewind → branch again → store complete tree → library → reopen theme/tree → fork → continue → active-path export flow passes in automated tests and in a production-like manual smoke test. The final implementation report must list changed files, schema/API behavior, genre system, tree persistence, snapshot/fork behavior, tests run, build results, and remaining limitations.

## 14. Assumptions locked for implementation

- Greenfield application; no existing code is available to preserve.
- Anonymous database-backed workspace in v1; authentication is deferred.
- Store uses immutable complete-tree snapshots.
- Snapshot continuation always creates a new editable fork.
- No destructive undo and no same-choice regeneration in v1.
- Fixed genres and fixed tones are mandatory.
- The active path is derived from `activeSceneId` and parent relationships.