# PlotWeaver: 3-Minute Live Hackathon Pitch Playbook
## Official Presentation Script & Demo Playbook (`view.pdf` Section 9 Aligned)

---

## Executive Pitch Overview

- **Product**: PlotWeaver — AI Short Story Co-Writer with Plot Branching
- **Target Pitch Length**: Exactly 3 Minutes (180 Seconds)
- **Presenter Setup**:
  - Web Application: `http://localhost:5173` (Full Screen, 100% Zoom)
  - Backend API: `http://localhost:3001` (Running with Demo Safety Switch active)
- **Judges / Evaluation Bot Scoring Focus**:
  1. **Functional Integrity**: Coherent depth $\ge 4$, zero sibling contamination, clean manuscript export.
  2. **User Experience (UX)**: Glowing active path, node badges, dynamic 10-genre atmosphere morphing.
  3. **Prompt Engineering**: Triad Divergence (`[CONFRONTATION]`, `[INVESTIGATION]`, `[DIVERGENCE]`).
  4. **State Management**: Non-destructive time-travel rewinds, deep-copy snapshots, and snapshot forking.

---

## 3-Minute Pitch Script & Cue Sheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       3-MINUTE PRESENTATION TIMELINE                        │
├─────────────┬─────────────────────────────────┬─────────────────────────────┤
│ TIME (SEC)  │ PRESENTER ACTIONS (WHAT YOU DO) │ SPOKEN SCRIPT (WHAT YOU SAY)│
├─────────────┼─────────────────────────────────┼─────────────────────────────┤
│ 0:00 - 0:30 │ Start on PlotWeaver Home (/)    │ Hook & The Problem          │
│ 0:30 - 1:00 │ Click Benchmark #1 Preset       │ 1-Click World Morphing      │
│ 1:00 - 1:45 │ Click Choice 1 -> Rewind -> Alt │ The Divergence & Time Travel│
│ 1:45 - 2:15 │ Click Store Snapshot -> Vault   │ Multiverse Vault & Forking  │
│ 2:15 - 3:00 │ Click Export -> Open PDF        │ Publication-Ready Climax    │
└─────────────┴─────────────────────────────────┴─────────────────────────────┘
```

---

### Act 1: The Hook & The Problem (0:00 – 0:30)

**Screen**: Home Page (`http://localhost:5173`)

> *"Judges, writers face a devastating creative problem every single day: blank page paralysis. Existing writing tools help with grammar and spellcheck, but they don't help with interactive ideation. Traditional outline tools are strictly linear, while ChatGPT gives you a single boring paragraph without any concept of 'what if' branching.*
>
> *Meet **PlotWeaver**: an AI co-writer designed for creative brainstorming with plot branching, visual multiverse exploration, and publication-ready manuscript export."*

---

### Act 2: The 1-Click Transformation (0:30 – 1:00)

**Screen**: New Story Setup Page

**Presenter Action**:
1. Point to the **Quick-Start Benchmark Presets**:
   *"We built in the four official benchmark stories directly from the hackathon problem brief."*
2. Click **Preset #1: The Hidden Door** (Mystery / Detective • Noir).
3. Point out how Title, Tone, and Premise instantly populate:
   *"A detective finds a coded message in an old library book. The sender is someone she thought was dead."*
4. Click **"Start Writing & Generate Opening Scene"**.

> *"Watch what happens when we start writing. The entire studio morphs into a moody, rain-slicked Noir atmosphere with amber streetlight accents and literary serif typography. Within seconds, our AI engine generates a rich 400-word opening scene introducing Detective Sarah Chen trapped in the municipal library archives at night."*

---

### Act 3: The Triad Divergence & Time-Travel Rewind (1:00 – 1:45)

**Screen**: Story Workspace (`/workspace/:id`)

**Presenter Action**:
1. Scroll to the **Choice Deck** below the scene:
   *"Notice that our prompt engine doesn't return generic choices like 'open the door slowly' versus 'open the door quickly'. That fails the Prompt Engineering test.*
   *Instead, we enforce our **Triad Divergence Framework**:
   - `⚡ [CONFRONTATION]`: Draw weapon and confront the intruder in the stacks.
   - `🔎 [INVESTIGATION]`: Pocket the note and research the signature in the microfilm vault.
   - `🌀 [DIVERGENCE]`: Pull the fire alarm to force a chaotic public evacuation."*
2. Click **Choice 1 (`[CONFRONTATION]`)**.
   - Watch the SVG Visual Tree on the left dynamically grow Scene 2.
   - The active path lights up in radiant glowing amber (`--theme-accent`).
3. **The Climax of State Management (Non-Destructive Time Travel)**:
   - Click back to **Scene 1 (Root)** directly on the Visual Tree Canvas.
   - Show the reader instantly jump back to Scene 1 with the ambient banner:
     *"⏳ Viewing historical decision point. Select an unexplored choice to branch a new reality without altering existing branches."*
4. Click **Choice 2 (`[INVESTIGATION]`)**:
   - Scene 2B sprouts from the root!
   - Both branches persist in the visual tree simultaneously. The active path reroutes dynamically, while the alternate branch remains visible at 55% opacity.

> *"Judges, most apps implement 'undo' as a destructive button that deletes your work. PlotWeaver is a true directed acyclic multiverse graph. Every explored branch persists forever with zero context drift or sibling contamination."*

---

### Act 4: The Multiverse Vault & Universe Forking (1:45 – 2:15)

**Screen**: Header Buttons

**Presenter Action**:
1. In the header bar, click **"Store Snapshot"**.
   - A toast notification confirms: *"Multiverse Snapshot Preserved!"*
2. Click **"Vault"** (or navigate to `/library`).
3. Point to the gallery of saved universes:
   *"Here in the Multiverse Vault, we see our deep-copied snapshots. Notice that unlike other apps, we never collapse the story into a flat text file. The entire branching multiverse—all scenes and choices—is preserved as an immutable archive."*
4. Click **"Fork & Continue Timeline"** on the Sci-Fi *"Event Horizon Protocol"* snapshot.
   - Show the workspace reload instantly with the forked story, remapped IDs, and complete branch tree restored!

---

### Act 5: The Climax: Publication-Ready Export (2:15 – 3:00)

**Screen**: Story Workspace $\rightarrow$ Export Modal

**Presenter Action**:
1. Click **"Export Draft"** in the header.
2. The modal pops up showing:
   - Compiled scenes count
   - Total word count (~1,800 words)
   - Reading time (~9 minutes)
   - Clean Export Guarantee badge (Invariant 10)
3. Click **"Download PDF"** (or click "Download MD" for Markdown).
4. Open the downloaded PDF in the browser or PDF reader and scroll through:
   - Show the elegant **Title Page Block**:
     - *EVENT HORIZON PROTOCOL*
     - *A SCIENCE FICTION Tale • Dark Tone*
     - Premise quote block
     - Manuscript specifications box (Length, Words, Date, Author attribution)
   - Show the **Narrative Body Pages**:
     - Running headers ("EVENT HORIZON PROTOCOL")
     - Running footers ("Page 2 of 4")
     - Cinematic scene transitions (`*   *   *`)
     - Complete narrative continuity.
     - **Point out**: Zero choice prompts, zero `[CONFRONTATION]` tags, and zero internal IDs leaked into the final manuscript!

> *"Judges: PlotWeaver doesn't just generate text. It gives writers an interactive, visual multiverse brainstorming partner that turns blank page paralysis into finished, publication-ready manuscripts.*
>
> *Thank you, and we're ready for your questions!"*

---

## Evaluation Bot Scoring Defense Cheat Sheet

| Rubric Pillar | Bot Scoring Trigger | Our Proof Point in Demo |
| :--- | :--- | :--- |
| **Functional Integrity** | Does the story stay coherent across deep branches? Are choices stitched cleanly? | Show PDF export. Strict ancestor traversal guarantees 0% sibling context contamination. |
| **User Experience (UX)** | Can the user tell where they are? Is backtracking effortless? | Glowing SVG Active Path, node status badges (`📍 Active`, `✓ Explored`, `✨ New`), dynamic 10-genre Chameleon Themes. |
| **Prompt Engineering** | Are the 2–3 choices genuinely distinct plot directions? | Triad Divergence Schema enforcing Action (`CONFRONTATION`), Lore (`INVESTIGATION`), and Twist (`DIVERGENCE`). |
| **State Management** | Does the app prevent desynchronization, racing double-clicks, and destructive undos? | Non-destructive time-travel rewinds, transactional concurrency locks, deep-copy Multiverse Vault, and snapshot forking. |
