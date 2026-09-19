# 🚀 PlotWeaver Studio — Quick Deployment Guide

Deploy **PlotWeaver Studio** directly from your GitHub repository ([`DAMERLA-ANAND/AI-Short-Story-Co-writer-with-Plot-Branching`](https://github.com/DAMERLA-ANAND/AI-Short-Story-Co-writer-with-Plot-Branching)).

---

## ⚡ Option 1: Render (Recommended — 100% Free & Fastest)

Because PlotWeaver's API now automatically builds and serves the React frontend bundle in production, you can deploy the **entire full-stack application as a single service** on Render in less than 3 minutes.

### Step 1: Sign In & Create New Web Service
1. Go to **[render.com](https://render.com/)** and sign in with **GitHub**.
2. Click the **"New +"** button at the top right and select **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and click **Next**.
4. Choose your repository: `DAMERLA-ANAND/AI-Short-Story-Co-writer-with-Plot-Branching`.

---

### Step 2: Configure Service Settings

Fill in the settings as follows:

| Field | Value |
| :--- | :--- |
| **Name** | `plotweaver-studio` *(or any name you prefer)* |
| **Region** | Choose the closest region (e.g., *Singapore*, *Oregon*, *Frankfurt*) |
| **Branch** | `main` or `test1` |
| **Root Directory** | *(Leave empty)* |
| **Runtime** | **Node** |
| **Build Command** | `pnpm install && pnpm build && pnpm db:push` |
| **Start Command** | `node apps/api/dist/server.js` |
| **Instance Type** | **Free** |

---

### Step 3: Add Environment Variables

Scroll down to the **"Environment Variables"** section and add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20.18.0` | Ensures Node 20 runtime |
| `LLM_PROVIDER` | `gemini` | Uses Google Gemini 3.5 Flash |
| `GEMINI_API_KEY` | *Your Google AI Studio Gemini API key* | [Get a free key here](https://aistudio.google.com/) |
| `CORS_ORIGIN` | `*` | Allows browser access |
| `DATABASE_URL` | `file:./dev.db` | Local SQLite database |

*(Optional: If you don't have a Gemini API key yet, set `LLM_PROVIDER=mock` to test instantly).*

---

### Step 4: Deploy!

1. Click **"Create Web Service"**.
2. Render will automatically:
   - Install dependencies with `pnpm`
   - Build `@plotweaver/shared`, `@plotweaver/web`, and `@plotweaver/api`
   - Push the Prisma SQLite database schema
   - Launch the server with live SSE streaming
3. Once the build finishes, open your live URL (e.g. `https://plotweaver-studio.onrender.com`)!

---

## 🚂 Option 2: Railway

1. Go to **[railway.app](https://railway.app/)** and login with GitHub.
2. Click **"New Project"** ➔ **"Deploy from GitHub repo"**.
3. Select `DAMERLA-ANAND/AI-Short-Story-Co-writer-with-Plot-Branching`.
4. In **Settings** ➔ **Build**:
   - **Build Command**: `pnpm install && pnpm build && pnpm db:push`
   - **Start Command**: `node apps/api/dist/server.js`
5. In **Variables**, add:
   - `LLM_PROVIDER=gemini`
   - `GEMINI_API_KEY=your_gemini_key`
   - `CORS_ORIGIN=*`
   - `DATABASE_URL=file:./dev.db`
6. Click **Generate Domain** to get your public URL.

---

## 🌐 Option 3: Vercel (Frontend) + Render (Backend API)

If you prefer hosting the React frontend on **Vercel**:

### 1. Deploy the Backend API on Render
- Follow **Option 1**, but set:
  - **Start Command**: `pnpm --filter @plotweaver/api start`
  - Note down your backend URL (e.g. `https://plotweaver-api.onrender.com`).

### 2. Deploy the Frontend on Vercel
1. Go to **[vercel.com](https://vercel.com/)** and import your GitHub repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm --filter @plotweaver/shared build && pnpm --filter @plotweaver/web build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://plotweaver-api.onrender.com`
4. Update `CORS_ORIGIN` on your Render backend to your Vercel URL (e.g. `https://your-app.vercel.app`).
5. Click **Deploy**!

---

## 🛠️ Deployment Troubleshooting

| Issue | Quick Fix |
| :--- | :--- |
| **`pnpm: command not found`** | Add environment variable `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` and use Node 18 or 20. |
| **Database missing tables** | Ensure your build command includes `pnpm db:push` before launching. |
| **AI generation shows timeout/error** | Verify that `GEMINI_API_KEY` is set correctly in the platform dashboard without extra quotes or spaces. |
| **SSE Streaming buffering** | Render and Railway support Server-Sent Events natively out of the box. |
