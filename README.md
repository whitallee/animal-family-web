# Animal Family Web

A Next.js web application for managing animal families, enclosures, and tasks.

**Backend Repository:** [animal-family-backend](https://github.com/whitallee/animal-family-backend)

> **Note:** This is currently in Pre-Alpha. If you'd like to collaborate, please reach out! Find my contact info on [whitcodes.dev/contact](https://whitcodes.dev/contact).

## Prerequisites

- Node.js 18+ and npm
- Backend API running (see [Backend Repository](https://github.com/whitallee/animal-family-backend))

## Running Locally

1. Clone the repository:
```bash
git clone https://github.com/whitallee/animal-family-web.git
cd animal-family-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query)

## Development Status

See [TODO.md](TODO.md) for planned features, known bugs, and upcoming work.