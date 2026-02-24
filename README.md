# Lax Practice

A youth lacrosse practice planner and drill tracker built with React, TypeScript, and Vite.

## Features

- **Drill Library** - Create and manage drills with descriptions, coaching points, YouTube video links, and categories
- **Practice Plans** - Build practice sessions with rotation stations, assign coaches, set drill durations
- **Drag & Drop** - Reorder drills within stations using drag and drop
- **Coach Management** - Add coaches and assign them to stations in your plans
- **Shareable Links** - Generate public links to share practice plans with coaches (includes embedded YouTube videos)
- **Printable Plans** - Print-optimized view for bringing plans to the field
- **Practice History** - Track which drills were used on which dates, view drill frequency, and add notes per practice
- **Date Tracking** - See drill usage history across all practice dates

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deploy to Vercel

```bash
npx vercel
```

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- @dnd-kit (drag and drop)
- localStorage for data persistence
