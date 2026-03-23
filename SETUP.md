# Greenlight Coaching Portal - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd greenlight-portal
npm install
```

### 2. Set Up Convex Backend
```bash
npx convex dev
```
This will:
- Prompt you to log in / create a Convex account (free)
- Create a new Convex project
- Generate the proper TypeScript types
- Start the Convex dev server

Leave this terminal running.

### 3. Start the Next.js Dev Server
In a **second terminal**:
```bash
npm run dev
```

### 4. Open the App
Go to **http://localhost:3000**

### 5. Create Your Account
On the login page, enter a username and password. Click **Register** to create your account. This will also seed the 9 default coachees.

---

## Tech Stack
- **Next.js 16** (App Router, TypeScript)
- **Convex** (Real-time database + backend)
- **Tailwind CSS v4** (Styling)
- **shadcn/ui** (Component library)
- **Recharts** (Analytics charts)
- **@dnd-kit** (Kanban drag-and-drop)
- **Mermaid** (Diagram support)
- **bcryptjs** (Password hashing)

## Features
- Dark theme with Greenlight green branding
- Password-protected login
- 9 pre-loaded coachees with real profiles
- Meeting history tracking
- Action items with Kanban board view
- Scheduling with .ics calendar invites
- Email recap generation
- Speaker notes with per-coachee star ratings
- Industry insights per coachee
- LinkedIn integration (Scrapin.io API)
- Analytics dashboard with charts
- Fully mobile responsive

## Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Set environment variables in Vercel dashboard:
- `CONVEX_DEPLOYMENT` (from `npx convex deploy`)
- `NEXT_PUBLIC_CONVEX_URL` (your Convex deployment URL)
