# TaskFlow

TaskFlow is a production-oriented project collaboration platform built with React, TypeScript, Vite, Tailwind CSS, Supabase, Cloudinary, Zustand, Recharts, and dnd-kit.

## Features

- Supabase auth flows: register, login, logout, forgot password, reset password, email verification, session persistence, and protected routes.
- Workspace, project, task, comment, attachment, notification, activity, and admin data model.
- Responsive SaaS dashboard with metrics, analytics charts, activity timeline, calendar, global search, admin panel, and settings.
- Drag-and-drop Kanban board with Todo, In Progress, Review, and Done columns.
- Task detail drawer with priority, status, assignee, deadline, comments, activity-friendly layout, and Cloudinary unsigned upload integration.
- Complete Supabase SQL migration with foreign keys, indexes, cascade rules, RLS, helper functions, and realtime publication.
- TaskFlow uses Cloudinary unsigned uploads for development and portfolio purposes. Files are uploaded directly from React and only metadata is stored in Supabase.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

4. Apply the database migration in Supabase SQL editor or with the Supabase CLI:

```bash
supabase db push
```

5. Run locally:

```bash
npm run dev
```

## Production Notes

- Cloudinary uploads use an unsigned upload preset for development and portfolio purposes. Files are uploaded directly from React and only metadata is stored in Supabase.
- Configure Supabase Auth redirect URLs for `/login`, `/reset-password`, and the deployed app URL.
- Keep RLS enabled for all tables. The migration includes role-based policies for admins, project managers, and team members.
- Add indexes for additional search filters as usage grows, especially full-text search over project/task/comment content.
- Deploy the frontend to Vercel, Netlify, Cloudflare Pages, or Supabase hosting-compatible static infrastructure with the same environment variables.
