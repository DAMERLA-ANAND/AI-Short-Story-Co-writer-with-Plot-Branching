# AI Short Story Co-Writer with Plot Branching

## Detailed Implementation Blueprint

## 1. Purpose and MVP definition

Build a web application where a writer enters a title, genre, tone, and premise; receives an AI-generated opening scene; chooses between two or three narrative directions; and recursively explores a branching story. The writer can navigate every explored branch and export the currently selected linear path as a clean draft.

### In-scope MVP capabilities

1. Create, persist, and reopen a story.
2. Generate a 300-500 word opening scene.
3. Generate exactly two or three choices for each generated scene.
4. Generate one child scene from a selected choice.
5. Preserve continuity using only the ancestry of the selected branch.
6. Render all generated scenes and unexplored choices as a clickable indented tree.
7. Allow the user to make any generated scene the active scene.
8. Export the active path as Markdown and PDF, excluding all choices and internal metadata.
9. Handle loading, validation, retry, generation failure, and duplicate requests safely.

### Explicitly deferred

- Authentication and personal multi-device libraries.
- Real-time multi-user collaboration.
- D3/canvas graph editing.
- AI fine-tuning or learned preferences.
- AI-assisted scene editing.
- Automated transition rewriting at export time.

## 2. Technical decisions

| Concern | Decision | Reason |
| --- | --- | --- |
| Repository | pnpm TypeScript monorepo | Shared contracts prevent frontend/backend drift. |
| Client | React, Vite, TypeScript, React Router, TanStack Query | Fast interactive UI and predictable server-state handling. |
| Server | Node.js, Express, TypeScript | Simple API, OpenAI integration, and PDF generation. |
| Database | Prisma with SQLite locally, PostgreSQL in production | Easy prototype setup with a production-safe migration path. |
| Generation | OpenAI Responses API behind a provider interface | Good creative quality without coupling business logic to one SDK. |
| Output format | Structured JSON validated with Zod | Prevents prose/choice parsing bugs. |
| Tree | Recursive indented DOM tree | Meets MVP navigation needs with low implementation risk. |
| Export | Server-generated Markdown and PDFKit PDF | Keeps output consistent and avoids browser print variability. |

## 3. Core rules and invariants

1. A story has exactly one root scene after opening generation succeeds.
2. A scene is immutable after it reaches `ready`; regenerating it is not an MVP operation.
3. A non-failed generated scene owns exactly two or three choices.
4. A choice belongs to one source scene and can produce no more than one child scene.
5. A child scene has one parent choice, so a scene has exactly one ancestry path.
6. Selecting an explored choice opens its existing child; it must never incur another AI request.
7. Context for a continuation comes only from root-to-source-scene ancestry, never sibling or descendant branches.
8. The active path is derived from `activeSceneId`; it is never stored as an editable array.
9. Export includes only ordered scene prose from root through active scene.
10. The browser never sends a full narrative, a raw prompt, or a scene body to generate a continuation. The server reconstructs the authoritative context.

## 4. Repository and file structure

```text
ai-story-cowriter/
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  ├─ migrations/
│  │  │  └─ seed.ts
│  │  ├─ src/
│  │  │  ├─ config/
│  │  │  │  ├─ env.ts
│  │  │  │  └─ logger.ts
│  │  │  ├─ controllers/
│  │  │  │  ├─ story.controller.ts
│  │  │  │  └─ export.controller.ts
│  │  │  ├─ middleware/
│  │  │  │  ├─ errorHandler.ts
│  │  │  │  ├─ notFound.ts
│  │  │  │  ├─ requestId.ts
│  │  │  │  └─ rateLimit.ts
│  │  │  ├─ prompts/
│  │  │  │  ├─ system.ts
│  │  │  │  ├─ openingScene.ts
│  │  │  │  ├─ continuationScene.ts
│  │  │  │  └─ repairOutput.ts
│  │  │  ├─ providers/
│  │  │  │  ├─ storyGeneration.provider.ts
│  │  │  │  ├─ openai.provider.ts
│  │  │  │  └─ mock.provider.ts
│  │  │  ├─ routes/
│  │  │  │  ├─ story.routes.ts
│  │  │  │  ├─ export.routes.ts
│  │  │  │  └─ health.routes.ts
│  │  │  ├─ services/
│  │  │  │  ├─ story.service.ts
│  │  │  │  ├─ storyContext.service.ts
│  │  │  │  ├─ generation.service.ts
│  │  │  │  ├─ export.service.ts
│  │  │  │  └─ tree.service.ts
│  │  │  ├─ validators/
│  │  │  │  ├─ story.validator.ts
│  │  │  │  └─ generatedScene.validator.ts
│  │  │  ├─ utils/
│  │  │  │  ├─ apiError.ts
│  │  │  │  ├─ asyncHandler.ts
│  │  │  │  ├─ filename.ts
│  │  │  │  └─ ids.ts
│  │  │  ├─ app.ts
│  │  │  └─ server.ts
│  │  ├─ tests/
│  │  │  ├─ unit/
│  │  │  ├─ integration/
│  │  │  └─ fixtures/
│  │  ├─ .env.example
│  │  └─ package.json
│  │
│  └─ web/
│     ├─ src/
│     │  ├─ api/
│     │  │  ├─ client.ts
│     │  │  └─ stories.api.ts
│     │  ├─ components/
│     │  │  ├─ common/
│     │  │  ├─ story/
│     │  │  └─ layout/
│     │  ├─ features/stories/
│     │  │  ├─ hooks/
│     │  │  ├─ storyTree.ts
│     │  │  ├─ storyPath.ts
│     │  │  └─ types.ts
│     │  ├─ pages/
│     │  │  ├─ StoryLibraryPage.tsx
│     │  │  ├─ NewStoryPage.tsx
│     │  │  └─ StoryWorkspacePage.tsx
│     │  ├─ styles/
│     │  ├─ test/
│     │  ├─ App.tsx
│     │  └─ main.tsx
│     ├─ e2e/
│     │  └─ story-flow.spec.ts
│     ├─ .env.example
│     └─ package.json
│
├─ packages/shared/
│  ├─ src/
│  │  ├─ api.ts
│  │  ├─ constants.ts
│  │  ├─ schemas.ts
│  │  ├─ types.ts
│  │  └─ index.ts
│  └─ package.json
├─ docs/
│  ├─ architecture.md
│  ├─ api-contract.md
│  ├─ prompt-design.md
│  └─ demo-script.md
├─ pnpm-workspace.yaml
├─ package.json
└─ README.md
```

## 5. Data model and Prisma schema

### Logical entities

`Story` stores story-level metadata and the currently viewed scene. `Scene` stores immutable generated prose and a concise summary for future context compression. `Choice` records the branch prompt shown after a scene and optionally points to the child scene it created.

```prisma
model Story {
  id            String      @id @default(cuid())
  title         String
  premise       String
  genre         String
  tone          String?
  status        StoryStatus @default(GENERATING)
  rootSceneId   String?     @unique
  activeSceneId String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  scenes        Scene[]
  choices       Choice[]
}

model Scene {
  id              String      @id @default(cuid())
  storyId         String
  parentChoiceId  String?     @unique
  depth           Int
  text            String
  summary         String
  status          SceneStatus @default(READY)
  generationError String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  story           Story       @relation(fields: [storyId], references: [id], onDelete: Cascade)
  parentChoice    Choice?     @relation("ChildScene", fields: [parentChoiceId], references: [id])
  choices         Choice[]    @relation("SourceScene")

  @@index([storyId])
}

model Choice {
  id              String   @id @default(cuid())
  storyId         String
  sourceSceneId   String
  childSceneId    String?  @unique
  ordinal         Int
  text            String
  narrativeIntent String
  createdAt       DateTime @default(now())
  story           Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
  sourceScene     Scene    @relation("SourceScene", fields: [sourceSceneId], references: [id], onDelete: Cascade)
  childScene      Scene?   @relation("ChildScene")

  @@index([storyId])
  @@index([sourceSceneId])
  @@unique([sourceSceneId, ordinal])
}

enum StoryStatus { GENERATING READY FAILED }
enum SceneStatus { GENERATING READY FAILED }
```

### Implementation note

Use a transaction to write a generated scene and all its choices. A tree must never contain a ready scene with only some of its choices. When generation fails, store the failure state on the reserved child scene or choice-generation record so the client can present a retry action.

## 6. Shared API contracts

All input and output schemas belong in `packages/shared/src/schemas.ts` and are used by both Express and React.

### Create a story

`POST /api/stories`

Request:

```json
{
  "title": "The Hidden Door",
  "genre": "mystery",
  "tone": "noir",
  "premise": "A detective discovers a hidden door in her office."
}
```

Validation:

- `title`: trimmed string, 1-120 characters.
- `genre`: one of `fantasy`, `science-fiction`, `romance`, `horror`, `thriller`, `mystery`, `literary`, `other`.
- `tone`: optional trimmed string, 1-80 characters.
- `premise`: trimmed string, 20-2,000 characters.

Success: `201 Created`, body is `StoryDetailResponse`.

Failure: `400` for invalid input, `429` for rate limiting, `502` for unrecoverable provider failure.

### List stories

`GET /api/stories`

Success: `200 OK` with story metadata only, newest first. Do not include full scene prose here.

### Get one story tree

`GET /api/stories/:storyId`

Success: `200 OK` with all story scenes/choices, selected active scene, and calculated active path.

### Continue a choice

`POST /api/stories/:storyId/continue`

Request:

```json
{ "choiceId": "choice_cuid" }
```

Server rules:

1. Confirm the story and choice exist and belong together.
2. If `childSceneId` exists, set it active and return it without a provider call.
3. Otherwise reserve the choice, build ancestry context, generate and validate one scene, atomically persist it and its choices, then set it active.
4. Return `200 OK` with the updated `StoryDetailResponse`.

### Change active scene

`POST /api/stories/:storyId/active-scene`

Request:

```json
{ "sceneId": "scene_cuid" }
```

The server verifies ownership, updates `activeSceneId`, recalculates path, and returns `200 OK` with `StoryDetailResponse`.

### Export

`GET /api/stories/:storyId/export?format=markdown|pdf`

Rules:

- Only `markdown` and `pdf` are valid formats.
- Export root-to-active-scene prose only.
- Set `Content-Disposition: attachment` with a sanitized filename.
- Use `text/markdown; charset=utf-8` for Markdown and `application/pdf` for PDF.

### Shared response contracts

```ts
type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
    requestId: string;
  };
};

type StoryDetailResponse = {
  story: StoryDto;
  scenes: SceneDto[];
  choices: ChoiceDto[];
  activePathSceneIds: string[];
};
```

Return no API key, raw provider response, stack trace, internal prompt, or database error to the browser.

## 7. Backend file responsibilities

| File/module | Responsibility |
| --- | --- |
| `app.ts` | Create Express app, JSON parser, CORS, routes, and error middleware. No business logic. |
| `server.ts` | Load configuration and listen on a port. |
| `config/env.ts` | Parse and validate environment variables once at startup. |
| `routes/*.ts` | Declare HTTP method/path and connect controller; no data access. |
| `controllers/story.controller.ts` | Parse route parameters/body, call services, map results to status code. |
| `services/story.service.ts` | Story creation, retrieval, activation, ownership checks, and response assembly. |
| `services/generation.service.ts` | Concurrency-safe choice continuation, provider call, validation/repair retry, transactional persistence. |
| `services/storyContext.service.ts` | Walk parent-choice chain and return chronological ancestry with choice history. |
| `services/tree.service.ts` | Validate graph relationships and compose tree-ready DTOs when needed. |
| `services/export.service.ts` | Reconstruct active path, produce Markdown, create PDF buffer, and sanitize document metadata. |
| `providers/storyGeneration.provider.ts` | Provider interface and input/output types. |
| `providers/openai.provider.ts` | Convert prompts to OpenAI request, read structured result, surface controlled errors. |
| `providers/mock.provider.ts` | Deterministic fixture scenes/choices for tests and demo fallback. |
| `prompts/*.ts` | Pure functions turning context into model messages. |
| `validators/*.ts` | Zod schemas for HTTP input and AI structured output. |
| `middleware/errorHandler.ts` | Map known `ApiError` objects to stable response shape; hide unknown details. |
| `utils/filename.ts` | Remove unsupported filename characters and add a fallback title. |

## 8. AI generation implementation

### Provider interface

```ts
export interface StoryGenerationProvider {
  generateOpening(input: OpeningGenerationInput): Promise<GeneratedScene>;
  generateContinuation(input: ContinuationGenerationInput): Promise<GeneratedScene>;
}
```

### Required generated result

```ts
type GeneratedScene = {
  sceneText: string;
  sceneSummary: string;
  choices: Array<{
    text: string;
    narrativeIntent: string;
  }>;
};
```

Validation after every provider call:

1. `sceneText` has 300-500 words, allowing a small configurable tolerance for model variation.
2. `sceneSummary` has 40-100 words.
3. There are exactly two or three choices.
4. Choice order is deterministic after persistence using `ordinal`.
5. Choice labels are non-empty, unique after lowercase normalization, and reasonably concise.
6. `narrativeIntent` is non-empty and not exposed to users unless needed for debugging.

If validation fails, call the provider one more time using `repairOutput.ts` with errors only. If repaired output also fails, return a controlled `GENERATION_INVALID_OUTPUT` failure; do not save invalid content.

### Context construction

For a selected choice, walk from its source scene through `parentChoiceId` to the root, then reverse the scenes. Pass all text for the MVP through depth 12. Beyond depth 12, use summaries for older scenes and full text for the latest four scenes. Always include title, premise, genre, tone, and each choice selected between scenes.

### Concurrency protection

Two browser clicks or retried requests can race. Before making an AI request, transact to reserve the target choice. If another request has already created a child scene or marked the choice as generating, return the existing result or `409 GENERATION_IN_PROGRESS`. Release/mark failed reservation if the provider fails. A database uniqueness constraint on `childSceneId` provides a final protection layer.

## 9. Frontend file and component responsibilities

| Component/file | Responsibility |
| --- | --- |
| `main.tsx` | Render React root and global providers. |
| `App.tsx` | Route declarations and application shell. |
| `api/client.ts` | Typed fetch wrapper, base URL, error parsing, request ID extraction. |
| `api/stories.api.ts` | One function per story endpoint. |
| `pages/StoryLibraryPage.tsx` | Display existing stories and create-story entry point. |
| `pages/NewStoryPage.tsx` | Render and submit premise form, field validation, redirect after success. |
| `pages/StoryWorkspacePage.tsx` | Load story by ID and compose workspace panels. |
| `StoryHeader` | Title, genre, status, export menu, and delete action. |
| `StoryTree` | Render root recursive tree and calculate expand/collapse state. |
| `StoryTreeNode` | Render one scene and its outgoing choice rows; active/path visual states; handle navigation. |
| `SceneReader` | Render active scene prose, status/error/loading UI, and available choices. |
| `ChoiceList` | Map choices in ordinal order; prohibit repeated click while pending. |
| `ChoiceButton` | Show choice text, prior exploration state, and selected loading state. |
| `CurrentPathBreadcrumb` | Render root-to-active scene sequence and permit direct navigation. |
| `GenerationState` | Reusable skeleton/spinner and accessible live status message. |
| `ErrorPanel` | Human-readable error, retry callback, and request ID for support. |
| `ExportMenu` | Trigger browser download of server-returned Markdown/PDF blobs. |
| `features/stories/storyPath.ts` | Pure active-path helpers for client display only; server remains authoritative. |
| `features/stories/storyTree.ts` | Pure tree lookup/order helpers; never issue HTTP requests. |

### React Query keys and mutations

```ts
["stories"]
["story", storyId]
```

- `useCreateStory`: POST story, populate cache, navigate to workspace.
- `useContinueStory`: POST continuation, replace the full `story` cache response.
- `useSetActiveScene`: optimistically highlight selected node; roll back if request fails.
- `useExportStory`: fetch binary blob; create temporary browser object URL and download it.

## 10. User interaction flows

### Create story

1. User opens `/new`.
2. Client validates visible fields on blur and submit.
3. Submit disables form and announces generation progress.
4. API creates/opening-generates story.
5. Client stores result in query cache and navigates to `/story/:id`.
6. Workspace shows root scene and choices.

### Explore a branch

1. User selects a choice below a ready scene.
2. Client disables every choice of that source scene.
3. API either opens existing child or creates a child scene.
4. Client replaces cached tree response.
5. Client scrolls the reader to top and focuses scene heading for keyboard/screen-reader users.
6. Tree expands to reveal the new child and active path is highlighted.

### Navigate

1. User clicks any generated scene node or breadcrumb entry.
2. Client calls active-scene endpoint.
3. Server validates ownership and changes only active selection.
4. Reader changes content; no AI call occurs.

### Export

1. User chooses Markdown or PDF.
2. Client requests export for current active scene.
3. Server compiles root-to-active path.
4. Browser downloads a file such as `the-hidden-door.md` or `the-hidden-door.pdf`.

## 11. Export details

Markdown format:

```md
# The Hidden Door

*Genre: Mystery · Tone: Noir*

---

[Scene 1 prose]

---

[Scene 2 prose]
```

PDF requirements:

- Generate server-side with PDFKit.
- Include title page, genre/tone metadata, body pages, page numbers, and title footer.
- Use safe margins and a readable body font.
- Word-wrap and paginate long scenes.
- Include scene prose only; never choices, summaries, IDs, prompt text, or debug content.
- Test PDF starts with `%PDF` and has non-zero page count.

## 12. Validation, error handling, and security

### HTTP status code policy

| Status | Code example | Meaning |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Input does not conform to contract. |
| 404 | `STORY_NOT_FOUND` | Story or owned resource does not exist. |
| 409 | `GENERATION_IN_PROGRESS` | The same choice is already being generated. |
| 422 | `STORY_NOT_READY` | Requested operation cannot occur in current state. |
| 429 | `RATE_LIMITED` | Client has exceeded permitted requests. |
| 502 | `GENERATION_PROVIDER_ERROR` | AI provider failed or timed out. |
| 500 | `INTERNAL_ERROR` | Unexpected server error; details only in logs. |

### Security checklist

- Keep `OPENAI_API_KEY` only in API environment variables.
- Enforce configured CORS origins.
- Use request body size limits.
- Validate all external input using Zod.
- Apply rate limits to story creation and continuation routes.
- Do not render generated scene text using dangerous HTML APIs.
- Sanitize download filenames.
- Log request ID, route, duration, provider latency, and safe error code only.
- Never log complete premise or scene prose in production by default.

## 13. Testing strategy

Use Vitest for unit tests, Supertest for API integration tests, React Testing Library for component tests, and Playwright for end-to-end browser tests. All automated tests use the mock generation provider; only a separate manually invoked smoke test may use a live provider.

### Unit tests: API services

| Test target | Cases |
| --- | --- |
| `storyContext.service` | Root-only context; depth-three ancestry ordering; excludes siblings; includes selected choices; depth-compression behavior. |
| `generation.service` | Creates child and choices; does not duplicate explored choice; retry repair path; invalid output rejected; provider failure marks state correctly. |
| `export.service` | Correct root-to-active ordering; ignores sibling branches; Markdown excludes choices; safe filename; PDF buffer created. |
| `filename.ts` | Removes path traversal and unsafe characters; fallback title; preserves reasonable names. |
| prompt builders | Includes required metadata and chronology; does not include non-ancestral scenes. |
| generated output validator | Valid 2-choice/3-choice results; rejects one/four choices, duplicate labels, empty text, invalid summary. |
| `tree.service` | Detects root; ordered choices; malformed/cyclic records rejected in defensive checks. |

### Unit tests: frontend

| Component | Cases |
| --- | --- |
| `NewStoryPage` | Required field errors, max-length handling, submit disabled while pending, server validation shown. |
| `SceneReader` | Renders prose, loading skeleton, generation failure/retry UI, hides choices for failed/generating scene. |
| `ChoiceList` | Sorts by ordinal, locks interaction while mutation pending, denotes explored choice. |
| `StoryTree` | Nested branch structure, active node styling, active path styling, expand/collapse, node navigation callback. |
| `ExportMenu` | Calls expected format endpoint and creates download from blob. |
| path helpers | Root-to-active extraction and no sibling inclusion. |

### API integration tests

Use a temporary SQLite database or isolated test PostgreSQL schema. Reset schema before each test suite; seed only fixtures needed by a test.

1. `POST /api/stories` with valid body returns `201`, one root scene, and 2-3 choices.
2. Invalid premise returns `400` with field-specific error details.
3. `GET /api/stories/:id` returns persisted tree after simulated application restart.
4. Continuing an unexplored owned choice creates exactly one child scene and 2-3 child choices.
5. Continuing the same choice again does not call mock provider again and returns existing child.
6. Continuing a choice from another story returns `404` and makes no database changes.
7. Concurrent continuation requests result in one child scene only.
8. Active-scene update changes active path but scene/choice counts remain unchanged.
9. Markdown export of a leaf scene includes exactly its ancestry prose and excludes all choice labels.
10. PDF export sends `application/pdf`, attachment header, and a parseable/non-empty PDF buffer.
11. Provider invalid response leads to one repair attempt and controlled failure if still invalid.
12. Provider timeout yields `502` and lets the choice be retried.

### End-to-end tests

Use Playwright against the full API and mock provider.

1. Create a mystery story from `/new` and reach workspace.
2. Verify opening scene and exactly 2-3 choices display.
3. Create two levels in the first branch.
4. Return to root and create a second branch.
5. Verify both branches exist in the indented tree.
6. Click first leaf; verify reader and breadcrumb reflect first route.
7. Export Markdown; inspect downloaded content for selected-scene prose and absence of choices.
8. Export PDF; verify download occurs and file is non-empty.
9. Simulate provider error; verify visible retry; retry successfully creates a single child.
10. Run one mobile viewport test to verify stacked workspace layout and accessible tree navigation.

### Manual quality checks

Test at least mystery, science fiction, fantasy, horror, and romance premises. For each, generate three depths and at least two sibling branches. Check character naming, chronology, repeated paragraphs, choices being distinct, readable export typography, and API latency/loading feedback.

## 14. Build sequence and acceptance gates

### Phase 1: foundation

1. Initialize workspace and strict TypeScript config.
2. Create shared schemas/types.
3. Add Prisma model, migration, and seed fixture.
4. Configure test database and mock provider.

**Gate:** database can create/read seed story; unit test suite runs.

### Phase 2: backend

1. Implement all story read/create/activation routes.
2. Implement context reconstruction and mock opening/continuation generation.
3. Add transactional persistence and duplicate prevention.
4. Implement Markdown/PDF export.
5. Add error middleware, request IDs, validation, and rate limits.

**Gate:** Supertest covers full create -> continue -> branch -> export flow.

### Phase 3: frontend

1. Build premise form and story library.
2. Build workspace, scene reader, choices, errors, loading state.
3. Build recursive indented tree and active-path breadcrumb.
4. Add mutations/cache refresh and export download.
5. Add responsive and keyboard-accessible interactions.

**Gate:** Playwright can create two branches, navigate, and export.

### Phase 4: live AI and prompt tuning

1. Implement OpenAI provider and environment configuration.
2. Add structured-output validation and repair retry.
3. Test 5+ diverse premises manually.
4. Tune prompts, summary length, word bounds, and model settings.

**Gate:** three-depth stories stay coherent and valid without manual database edits.

### Phase 5: release

1. Deploy API and production PostgreSQL.
2. Deploy frontend and configure API/CORS URLs.
3. Run production smoke test.
4. Provide fallback seeded demo story and clear README.

**Gate:** a fresh public browser session completes the full workflow.

## 15. Environment variables

```dotenv
# apps/api/.env
NODE_ENV=development
PORT=3001
DATABASE_URL=file:./dev.db
CORS_ORIGIN=http://localhost:5173
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=
MAX_STORY_DEPTH=12

# apps/web/.env
VITE_API_BASE_URL=http://localhost:3001
```

## 16. Definition of done

The MVP is complete when a new writer can enter a premise, receive an opening scene, choose and generate at least two different branches, visually navigate every generated scene, select a desired branch as active, and download that root-to-active narrative as a valid Markdown or PDF draft. Automated unit, integration, and browser tests must pass using deterministic mock generation; live-provider smoke testing must also pass before deployment.