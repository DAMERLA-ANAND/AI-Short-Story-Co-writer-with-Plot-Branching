# AI Short Story Co-writer with Plot Branching

An AI-assisted short-story workspace for creating branching narratives, exploring alternate plot paths, and saving story snapshots.

## Setup

### 1. Get the project

Clone the repository and open its root directory:

```powershell
git clone <repository-url>
Set-Location AI-Short-Story-Co-writer-with-Plot-Branching
```

The repository is a pnpm monorepo with these main workspaces:

- `apps/web`: React and Vite frontend
- `apps/api`: Express API, Prisma, and story-generation providers
- `packages/shared`: Shared TypeScript types, schemas, genres, and tones

### Prerequisites

- Node.js 18 or newer
- pnpm 9 or newer

On Windows, enable pnpm with Corepack if it is not already installed:

```powershell
corepack enable
corepack prepare pnpm@9.15.9 --activate
```

Verify the tools:

```powershell
node --version
pnpm --version
```

### Install dependencies

Run these commands from the repository root:

```powershell
pnpm install
pnpm --filter @plotweaver/shared build
```

### Configure the API

Copy the example environment file:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

The API reads configuration from `apps/api/.env`:

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | API port | `3001` |
| `DATABASE_URL` | Prisma SQLite connection | `file:./dev.db` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:5173` |
| `LLM_PROVIDER` | `gemini`, `universal`, or `mock` | `gemini` |
| `GEMINI_API_KEY` | Optional Gemini API key | unset |

The local SQLite database does not require a separate database server.

The default configuration uses a local SQLite database at `apps/api/prisma/dev.db`. Generate the Prisma client and create the database schema:

```powershell
pnpm db:generate
pnpm db:push
```

To use Gemini for story generation, set `GEMINI_API_KEY` in `apps/api/.env`. Without a key, the built-in mock provider is used as a local fallback.

### Run the project

Start the API and web app in separate terminals:

```powershell
pnpm dev:api
```

```powershell
pnpm dev:web
```

Open the web app at [http://localhost:5173](http://localhost:5173). The API health check is available at [http://localhost:3001/api/health](http://localhost:3001/api/health).

If port `5173` is already in use, Vite selects another port such as `5174`. Update `CORS_ORIGIN` in `apps/api/.env` to match the selected web URL, then restart the API.

## Build

```powershell
pnpm build
```

## Tests

```powershell
pnpm test:all
```
