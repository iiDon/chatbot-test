# SDAIA Chat

An AI chat application built with Next.js 16, featuring real-time streaming responses, authentication, and chat history.

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **AI:**   AI SDK + OpenAI
- **Auth:** Better Auth
- **Database:** PostgreSQL + Prisma
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** TanStack React Query

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm prisma migrate dev (or npx prisma db push for dev environment + npx prisma generate) 

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # UI and page components
├── hooks/         # Custom React hooks
├── lib/           # Utilities, auth, prisma client
├── providers/     # React context providers
├── schemas/       # Zod validation schemas
├── server/        # Server actions and DB schema
└── types/         # TypeScript types
```

