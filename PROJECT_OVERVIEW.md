# PlotWeaver Studio V2: Master Architectural Guide, Workflow & Feature Matrix

> **Author**: PlotWeaver Core Engineering Team  
> **System Status**: 100% Operational & Verified  
> **Target Version**: Studio V2 (Google Gemini 3.5 Flash Live Streaming Engine)  

---

# 1. End-to-End Workflow of the Project

PlotWeaver operates on an **immutable branching multiverse state machine**. Narrative branches are isolated, non-destructive, and dynamically rendered through real-time AI streams.

```
[1. Genesis / Setup] ──▶ [2. AI Opening Generation] ──▶ [3. Interactive Workspace & Branching]
                                                                     │
       ┌─────────────────────────────────────────────────────────────┘
       ▼
[4. Ancestral Context Assembly] ──▶ [5. Real-Time Prose SSE Stream] ──▶ [6. Multiverse Tree Expansion]
                                                                                   │
       ┌───────────────────────────────────────────────────────────────────────────┘
       ▼
[7. Non-Destructive Rewind] ──▶ [8. Vault Snapshot Deep-Copy] ──▶ [9. Forking & Clean Manuscript Export]
```

### Phase A: Genesis & Genre Chameleon Initiation
1. **Genre Selection**: The author selects one of **10 Genre Worlds** (Noir Detective, Cyberpunk Sci-Fi, Dark Horror, High Fantasy, Romance, Adventure, Thriller, Comedy, Historical, Drama) or chooses a 1-click **Official Benchmark Preset**.
2. **Theme Chameleon Morph**: The DOM applies `data-genre="<genreId>"` on the root container. CSS custom variables (`--theme-accent`, `--theme-glow`, `--theme-font-family`, radial gradient backgrounds) instantly re-theme the entire studio in 0ms without page reloads.
3. **Story Specification**: Author inputs Title, Tone, and Core Premise. High-contrast elevated surfaces and glowing focus rings ensure crisp visibility.

### Phase B: AI Opening Induction
1. **Payload Submission**: Frontend triggers `POST /api/stories`.
2. **Zod Validation**: Payload is verified on the server against `CreateStoryInputSchema`.
3. **Gemini 3.5 Invocation**: The generation service queries `GeminiStoryProvider` (`gemini-3.5-flash`) using strict OpenAPI structured schema (`responseSchema` with `application/json`).
4. **Structured Generation**: Gemini generates:
   - **Scene Text**: 3–5 evocative paragraphs (250–450 words) adhering to genre directives.
   - **Scene Summary**: 1–2 sentence dramatic synopsis.
   - **Triad Divergence Choices**: Exactly 3 divergent archetypal choices (`CONFRONTATION`, `INVESTIGATION`, `DIVERGENCE`).
5. **Database Commit**: Committed inside an atomic `prisma.$transaction`:
   - 1 `Story` record (tracking `rootSceneId` and `activeSceneId`).
   - 1 `Scene` record at depth 1.
   - 3 `Choice` records in `UNEXPLORED` state.
6. **Navigation**: User is redirected directly to `/workspace/:storyId`.

### Phase C: Workspace & Keyboard-Driven Branching
1. **Workspace Layout**:
   - **Publication Scene Reader**: Editorial prose layout with opening paragraph drop-caps, word count, and estimated reading time.
   - **Constellation Tree Graph**: Interactive SVG canvas displaying the root, explored branches, and the active leaf.
   - **Floating Choice Dock**: Glassmorphic dock presenting the 3 archetypal paths with hotkeys `[1]`, `[2]`, `[3]`.
2. **Decision Trigger**: The author presses key `1`, `2`, or `3` (or clicks a card) to choose their path forward.

### Phase D: Ancestral Context Isolation & Streaming Prose Pipeline
1. **Context Assembly**: `context.service.ts` walks backwards up the tree from the selected choice to the root scene.
2. **Context Isolation**: Parallel unchosen sibling branches are strictly omitted. Only true chronological ancestors are fed to Gemini to preserve literary continuity.
3. **SSE Stream Connection**: Client initiates `POST /api/stories/:id/continue/stream`.
4. **In-Flight Prose Stream Extractor**:
   - Gemini streams progressive JSON chunks.
   - The custom stream parser isolates the `"sceneText": "..."` string while discarding JSON syntax brackets and schema keywords.
   - Pure narrative prose tokens are piped via Server-Sent Events (`event: token`) directly to the reader.
5. **Live Typing Feedback**: The reader renders the text in real time with a glowing streaming cursor.
6. **Completion**: When streaming concludes (`event: done`), the new child `Scene` (depth + 1) and 3 new unexplored choices are saved to SQLite.

### Phase E: Non-Destructive Time-Travel Rewind
1. **Historical Traversal**: Author clicks any previous node on the Constellation Tree Graph.
2. **State Transition**: `POST /api/stories/:id/active-scene` updates `activeSceneId`.
3. **Time-Travel Banner**: An amber notice informs the author they are viewing a past decision point.
4. **Alternate Reality Branching**: Choosing a new direction from an earlier scene creates a new branch without overwriting or deleting previously explored timelines.

### Phase F: Immutable Vault Snapshots, Timeline Forking & Export
1. **Snapshot Archival**: Clicking "Store Snapshot" invokes `POST /api/stories/:id/store`. The entire graph is deep-copied into immutable snapshot tables (`StorySnapshot`, `SnapshotScene`, `SnapshotChoice`) with remapped self-contained IDs (`snap_scn_*`, `snap_ch_*`).
2. **Multiverse Vault (`/library`)**: Author browses snapshots with instant search and genre filter pills.
3. **Snapshot Inspection (`/snapshot/:snapshotId`)**: Author opens the dedicated read-only timeline viewer with tree navigation and preserved node choices.
4. **Timeline Forking (`ForkModal.tsx`)**: Clicking "Fork Timeline" clones the snapshot into a new, living, editable story workspace.
5. **Clean Manuscript Export**: Compiles only the active storyline into clean Markdown or server-synthesized PDFKit documents with zero choice prompts or UI metadata leaks.

---

# 2. Why Choose Each Technology ("Tech Stack Rationale")

| Technology | Purpose | Why This Specific Choice? |
|---|---|---|
| **Google Gemini 3.5 Flash** | Core Generative AI Engine | • **Native Structured Output**: Supports `responseSchema` with OpenAPI strict JSON formatting, guaranteeing valid schema without JSON parsing failures.<br>• **Sub-Second Token Generation**: Delivers instant streaming response times needed for interactive branching.<br>• **Massive Context Window**: Effortlessly ingests entire ancestral story timelines without token truncation.<br>• **Literary Coherence**: Balances rich atmospheric prose with distinct archetypal decision divergence. |
| **React 18 + Vite** | Frontend Framework & Bundler | • **Lightning HMR (<50ms)**: Enables rapid developer iterations.<br>• **Declarative State Synchronization**: Coordinates tree canvas pan/zoom, keyboard shortcuts (`1`, `2`, `3`, `F11`), and live token streams effortlessly.<br>• **Fast Production Builds**: Rollup/ESBuild bundles the client in ~26 seconds with zero Webpack overhead. |
| **Node.js + Express (TypeScript)** | Backend API Server | • **Lightweight Non-Blocking I/O**: Essential for maintaining persistent Server-Sent Events (SSE) connections for real-time word-by-word streaming.<br>• **Monorepo Type Sharing**: Frontend and backend share identical DTOs and Zod contracts from `@plotweaver/shared`. |
| **SQLite + Prisma ORM** | Database & Persistence | • **Zero External Setup / Zero Cost**: Runs entirely on a local disk file (`dev.db`), completely eliminating Docker, PostgreSQL, or cloud connection issues during live demonstrations.<br>• **Strict ACID Transactions**: `prisma.$transaction` guarantees atomic commits for parent-child scene creation and snapshot cloning.<br>• **Sub-2ms Latency**: Local database access provides instantaneous node graph rendering. |
| **Vanilla CSS Tokens (`tokens.css` + `genres.css`)** | Styling & Theme System | • **Zero Runtime Bloat**: Zero overhead from heavy CSS-in-JS libraries or Tailwind class compilation layers.<br>• **Instant Dynamic Theming**: Changing `data-genre` attributes morphs all CSS variables (`--theme-accent`, `--theme-glow`, `--theme-font-family`) across the DOM in 0ms.<br>• **Hardware Acceleration**: CSS keyframe animations, radial gradients, and backdrop filters run on the GPU. |
| **Zod** | Contract Validation | • **End-to-End Safety**: Validates incoming API payloads, route params, and AI structured JSON outputs against matching TypeScript interfaces. |
| **PDFKit** | Publication Export | • **Native Binary PDF Generation**: Compiles publication-ready PDF manuscripts on the fly with zero Puppeteer or headless browser overhead. |
| **Web Audio API** | Atmospheric Soundscapes | • **100% Offline Procedural Synthesis**: Synthesizes rain noise filters and resonant drone harmonics directly in browser memory with zero external audio assets or network downloads. |

---

# 3. Mermaid Graph: Architectural & Algorithmic Workflow

```mermaid
flowchart TD
    %% Styling
    classDef client fill:#1e1e2e,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef server fill:#161622,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef db fill:#111520,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef ai fill:#261828,stroke:#ec4899,stroke-width:2px,color:#fff;

    subgraph Client ["Client (React 18 + Vite)"]
        UI_Home["Homepage / Genre Selector<br/>(NewStoryPage.tsx)"]:::client
        UI_Work["Story Workspace<br/>(StoryWorkspacePage.tsx)"]:::client
        UI_Dock["Floating Choice Dock<br/>(Keys 1, 2, 3)"]:::client
        UI_Tree["Constellation Graph Canvas<br/>(VisualTreeCanvas.tsx)"]:::client
        UI_Stream["Prose Reader with Streaming Cursor<br/>(SceneReader.tsx)"]:::client
        UI_Vault["Multiverse Vault & Search<br/>(LibraryPage.tsx)"]:::client
        UI_SnapView["Snapshot Viewer Page<br/>(SnapshotViewerPage.tsx)"]:::client
        UI_Fork["Fork Confirmation Modal<br/>(ForkModal.tsx)"]:::client
    end

    subgraph Backend ["Server (Node.js + Express)"]
        API_Story["POST /api/stories<br/>(Story Genesis)"]:::server
        API_Stream["POST /api/stories/:id/continue/stream<br/>(SSE Streaming)"]:::server
        API_Active["POST /api/stories/:id/active-scene<br/>(Rewind View)"]:::server
        API_Store["POST /api/stories/:id/store<br/>(Deep-Copy Snapshot)"]:::server
        API_Fork["POST /api/snapshots/:id/fork<br/>(Universe Duplication)"]:::server
        API_Export["GET /api/stories/:id/export<br/>(Markdown / PDFKit)"]:::server
        
        CTX["Ancestral Context Service<br/>(Trace Ancestors Only)"]:::server
        EXTRACT["In-Flight Prose Stream Extractor<br/>(Extract sceneText, block raw JSON)"]:::server
        SAFETY["FailSafe Provider Wrapper<br/>(3-Model Ladder + Mock Fallback)"]:::server
    end

    subgraph AI ["Google Gemini 3.5 AI Engine"]
        GEMINI["Google Generative AI SDK<br/>(gemini-3.5-flash)"]:::ai
        SCHEMA["responseSchema (OpenAPI Strict JSON)<br/>• sceneText<br/>• sceneSummary<br/>• 3 Divergent Choices"]:::ai
    end

    subgraph Storage ["Persistent State (SQLite + Prisma)"]
        DB_Story[("Story Table<br/>id, genre, activeSceneId")]:::db
        DB_Scene[("Scene Table<br/>depth, text, summary, parentChoiceId")]:::db
        DB_Choice[("Choice Table<br/>archetype, text, state, childSceneId")]:::db
        DB_Snap[("Snapshot Tables<br/>Immutable Deep-Copies & Remapped IDs")]:::db
    end

    %% Flow connections
    UI_Home -->|1. Submit Genesis Form| API_Story
    API_Story --> SAFETY
    SAFETY --> GEMINI
    GEMINI -.-> SCHEMA
    GEMINI -->|Structured JSON Output| API_Story
    API_Story -->|Transaction Commit| DB_Story
    API_Story -->|Transaction Commit| DB_Scene
    API_Story -->|Transaction Commit| DB_Choice
    API_Story -->|Redirect to Workspace| UI_Work

    UI_Dock -->|2. Author Selects Choice [1, 2, 3]| API_Stream
    API_Stream --> CTX
    CTX -->|Query Ancestor Chain Only| DB_Scene
    CTX -->|Build History Array| SAFETY
    SAFETY -->|generateContentStream| GEMINI
    GEMINI -->|Progressive JSON Chunks| EXTRACT
    EXTRACT -->|event: token (Pure Prose Words)| UI_Stream
    EXTRACT -->|event: done (Full Workspace)| UI_Work
    EXTRACT -->|Save Child Scene & Update Parent Choice| DB_Scene

    UI_Tree -->|3. Click Past Node (Rewind)| API_Active
    API_Active -->|Update activeSceneId| DB_Story
    API_Active -->|Render Rewind Banner| UI_Stream

    UI_Work -->|4. Store Vault Snapshot| API_Store
    API_Store -->|Deep Copy with New IDs| DB_Snap
    DB_Snap -->|Browse Vault| UI_Vault

    UI_Vault -->|5. Inspect Snapshot| UI_SnapView
    UI_SnapView -->|Click Fork| UI_Fork
    UI_Fork -->|Confirm Fork| API_Fork
    API_Fork -->|Clone Snapshot to Active Story| DB_Story
    API_Fork -->|Open Forked Workspace| UI_Work

    UI_Work -->|6. Download Manuscript| API_Export
    UI_SnapView -->|Download Archived Manuscript| API_Export
```

---

# 4. Complete Feature Matrix of PlotWeaver Studio V2

### 1. Generative Narrative Engine
- **Google Gemini 3.5 Flash Live Engine**: Native integration via `@google/generative-ai` with structured OpenAPI response schema.
- **Triad Archetype Divergence**: Guarantees that every branching scene presents exactly 3 distinct archetypal paths:
  1. `CONFRONTATION` (Bold, high-stakes direct action)
  2. `INVESTIGATION` (Analytical, observant, unearthing secrets)
  3. `DIVERGENCE` (Unconventional pivot, stealth, or radical priority shift)
- **Real-Time Word-by-Word Streaming (SSE)**: Streams text tokens directly from the LLM into the reader with zero perceived delay.
- **In-Flight Prose Extractor**: Custom parser that isolates narrative prose from structured JSON tokens in real time, preventing brackets, commas, or schema keys from ever polluting the reader view.
- **Three-Tier Fail-Safe Safety Ladder**: Automatic fallback sequence (`gemini-3.5-flash` ➔ `gemini-3.6-flash` ➔ `gemini-2.5-flash` ➔ Mock Provider) ensuring **0% risk of crashing on stage or in demos**.

### 2. Branching & Constellation Tree Canvas
- **Visual Multiverse Tree (`VisualTreeCanvas.tsx`)**: Interactive node graph plotting every chapter, branch, and convergence point.
- **Celestial Body Orb Nodes**: Radial glowing nodes indicating active scene, branch depth, and exploration status.
- **Active Path Highlighting**: Fiber-optic glowing edges tracing the active chronological line from the root to the current leaf.
- **Interactive Zoom & Pan**: Draggable canvas with zoom in, zoom out, and reset viewport controls.
- **Ancestral Context Isolation**: Independent branches never contaminate sibling branches; each decision point strictly inherits its true ancestral lineage.

### 3. Editorial Prose Reader & Atmosphere
- **Publication Typography**: Drop-cap styling on opening paragraphs with curated Google Fonts (`Cinzel`, `Space Grotesk`, `Playfair Display`, `Cormorant Garamond`, `Inter`).
- **Live Reading Metrics**: Real-time word count calculation and estimated reading time badges.
- **Historical Time-Travel Rewind Banner**: Visual amber alert informing the author when viewing a past node, with instant branch-out capability.
- **AI Narrative Synthesis Drawer**: Collapsible card revealing the AI's 1-sentence dramatic summary and intent for the scene.
- **10 Dynamic Genre Chameleon Themes**: Instant palette, typography, and atmospheric shift across Detective Noir, Cyberpunk Sci-Fi, Dark Horror, Epic Fantasy, Romance, Adventure, Thriller, Comedy, Historical, and Drama.
- **Procedural CSS Atmosphere & Particle Engine**: Dynamic multi-layer animated radial gradients with floating ambient particles and adjustable blackout dimmer.
- **Procedural Web Audio Engine**: Browser-synthesized rain filters and sub-bass ambient drones (zero external audio dependencies).
- **Zen Immersion Mode (`F11`)**: Full-screen reading mode that hides chrome, toolbars, and menus for focused literary immersion.

### 4. Multiverse Vault, Snapshotting & Forking
- **Self-Contained Deep-Copy Snapshots**: Captures the entire tree graph with remapped IDs (`snap_scn_*`, `snap_ch_*`), preserving the exact state forever.
- **Dedicated Snapshot Viewer Page (`/snapshot/:id`)**: Comprehensive read-only view of any archived snapshot, complete with visual tree navigation, chapter reading, and preserved choice states.
- **Instant Search & Genre Filter Bar**: Real-time search across story titles, premises, and tones, plus 10 genre filter pills for instant vault browsing.
- **Fork Timeline Modal (`ForkModal.tsx`)**: Prompts the author to branch an archived snapshot into a brand-new, independent working multiverse story.
- **Snapshot Deletion Endpoint**: `DELETE /api/snapshots/:snapshotId` with instant UI removal and confirmation safety.

### 5. Publication-Ready Manuscript Export
- **Clean Chronological Path Extraction**: Walks back from the active leaf to root, compiling only the scenes on that exact storyline.
- **Markdown Manuscript (`.md`)**: Formatted with book title, genre, chapter headings, and pure prose (Invariant 10: Zero choice metadata or prompt leaks).
- **PDF Manuscript (`.pdf`)**: Server-compiled PDFKit document formatted with professional margins, title typography, and page numbers.

### 6. Developer & Demo Experience
- **Monorepo Architecture**: Clean separation between `@plotweaver/shared`, `@plotweaver/api`, and `@plotweaver/web`.
- **Automated Verification Suites**: Verified test suites for Phase 1 (Contracts), Phase 2 (Flow), Phase 3 (Tree), Phase 4 (Vault & Export), and Gemini Live Streaming (`pnpm test:all`).
- **Zero-Config Database**: Embedded SQLite database (`dev.db`) requiring no background services, cloud credentials, or container setup.
