# Greenlight Coaching Portal - Setup Guide

## Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+ (ships with Node.js)
- A free [Convex](https://convex.dev) account

## Quick Start (Local Development)

### 1. Clone and install

```bash
git clone <repo-url>
cd greenlight-portal
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env.local
```

### 3. Set up Convex backend

In a dedicated terminal, run:

```bash
npm run dev:convex
```

This will:
- Prompt you to log in or create a Convex account (free tier is fine)
- Create a new Convex project (or link an existing one)
- Generate TypeScript types in `convex/_generated/`
- Start the Convex dev server and watch for schema changes

Once the Convex dev server is running, copy the deployment URL it prints (looks like `https://your-project-slug.convex.cloud`) and paste it into `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=https://your-project-slug.convex.cloud
```

**Leave this terminal running.**

### 4. Start the Next.js dev server

In a **second terminal**:

```bash
npm run dev
```

### 5. Open the app

Go to **http://localhost:3000**

### 6. Create your account

On the login page, enter a username and password, then click **Create Account**. This will also seed 9 default coachees into your database.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Backend / DB | Convex (real-time database + serverless functions) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI primitives |
| Charts | Recharts |
| Drag-and-drop | @dnd-kit |
| Diagrams | Mermaid |
| Auth | Custom session-based (bcryptjs / SHA-256) |

## Project Structure

```
greenlight-portal/
  convex/            # Convex backend (schema, mutations, queries)
  public/            # Static assets
  src/
    app/             # Next.js App Router pages
      (portal)/      # Authenticated layout group
    components/
      auth/          # Login form, auth guard
      charts/        # Recharts dashboard charts
      coachee/       # Coachee profile tabs
      dashboard/     # Dashboard widgets
      kanban/        # Kanban board
      layout/        # Sidebar, header, logo
      providers/     # Convex + Auth context providers
      shared/        # Reusable dialogs, empty states
      speakers/      # Speaker cards and ratings
      ui/            # shadcn/ui primitives
    hooks/           # Custom React hooks
    lib/             # Utilities (email recap, ICS generation)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run dev:convex` | Start Convex dev server (watches schema changes) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run convex:deploy` | Deploy Convex functions to production |

## Environment Variables

| Variable | Required | Where | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | `.env.local` | Your Convex deployment URL |
| `CONVEX_DEPLOYMENT` | Deploy only | Vercel env vars | Convex deployment name for CI builds |

See `.env.example` for a ready-to-copy template.

---

## Deploy to Vercel

### Option A: Vercel Dashboard (recommended)

1. Push your repo to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set the following **environment variables** in the Vercel project settings:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_CONVEX_URL` | Your production Convex URL (e.g. `https://your-project.convex.cloud`) |
   | `CONVEX_DEPLOYMENT` | Your Convex deployment name (e.g. `team/project`) |

4. Set the **Build Command** override to:
   ```
   npx convex deploy --cmd "next build"
   ```
   This deploys your Convex functions and then builds the Next.js app in one step.

5. Click **Deploy**.

### Option B: Vercel CLI

```bash
# Install the CLI (if you haven't already)
npm install -g vercel

# Deploy Convex functions to production first
npm run convex:deploy

# Then deploy to Vercel
vercel --prod
```

Set the environment variables via the Vercel dashboard or CLI:

```bash
vercel env add NEXT_PUBLIC_CONVEX_URL production
vercel env add CONVEX_DEPLOYMENT production
```

### Custom domain

After deploying, go to your Vercel project settings, then **Domains**, and add your custom domain.

---

## Features

- Dark theme with Greenlight green branding
- Password-protected login with session management
- 9 pre-loaded coachees with real profiles
- Meeting history tracking
- Action items with Kanban board view
- Scheduling with .ics calendar invite downloads
- Email recap generation (opens default mail client)
- Speaker notes with per-coachee star ratings
- Industry insights per coachee
- Analytics dashboard with charts
- Fully mobile responsive
