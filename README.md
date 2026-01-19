# Animal Family Web

A Next.js web application for managing animal families, enclosures, and tasks.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see [Backend Repository](https://github.com/whitallee/animal-family-backend))

### Installation

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
```bash
NEXT_PUBLIC_API_BASE_URL
```

**Note:** Update `NEXT_PUBLIC_API_BASE_URL` to match your backend API URL. For local development, the default is `http://localhost:8080` (or whatever port your backend runs on).

4. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📚 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query)

## 📋 Todo List

### High Priority - Core Features

- [ ] **Animal lifecycle management**
  - [X] Mark animal as passed away (RIP)
  - [X] Add "In Memorium" section
  - [ ] Add settings section in UserDrawer
  - [ ] Toggle visibility for In Memorium section in settings

- [ ] **Enclosure creation enhancement**
  - [ ] Create enclosure with animals that already exist in family

- [ ] **Fixes**
  - [ ] Glitchy when quick jumping to task
  - [ ] make big home screen scroll bar invisible or pushed more to the right
  - [ ] URL query params leads to jumping to that on every reload (like after saving changes) (if user clicks navbar, it should clear query param, and if user opens any accordion, it should update param to be that)
  - [ ] home screen needs to refresh after deleting enclosure without deleting its animals, because it doesn't show them at first
  - [ ] after user deletes an animal or enclosure or task, if its part of the URL query, it should be removed
  - [ ] make the family page and task page unnavigable while off the screen
  - [ ] make delete enclosure options be a radio button selection where the user must choose exactly what they want to delete

- [ ] **Earlier Future Features (unorganized)**
  - [ ] Sort options and preferences for family lists, home page, and tasks
  - [ ] should have option (default actually) to show completed tasks underneath animal and enclosure accordion
  - [ ] add/remove animals in enclosure button
  - [ ] redo Add Anything drawer to be a dialog box, that walks you step by step thru the creation process, for better UX
  - [ ] maybe redo the UserDrawer to be a dialog box.

### MVP - Transfer Features (Big Goal)

- [ ] **Transfer ownership (adopt out)**
  - [ ] Backend implementation for transfer ownership
  - [ ] Generate barcode/link for transfer
  - [ ] Authentication on both ends (sender and recipient)
  - [ ] Full ownership transfer functionality
  - [ ] UI for displaying transfer barcode/link
  - [ ] UI for scanning/clicking transfer link

- [ ] **Pet sitter transfer (temporary)**
  - [ ] Make sure structure is setup to handle multiple "owners"
  - [ ] Backend implementation for temporary transfer
  - [ ] Generate barcode/link for pet sitter access
  - [ ] Set time limit for temporary access
  - [ ] Maintain OG owner access during temporary transfer
  - [ ] Automatic revocation after time limit expires
  - [ ] UI for managing temporary transfers

### Future Features

- [ ] **AI-generated content** (requires backend implementation first)
  - [ ] AI-generated species
  - [ ] AI-generated habitats

- [ ] **Animal history/timeline** (requires backend implementation first)
  - [ ] Ownership transfer history
  - [ ] Vet visits tracking
  - [ ] Medical history
  - [ ] Vaccination records
  - [ ] Timeline UI component

- [ ] **Task history** (requires backend implementation first)
  - [ ] Task completion history
  - [ ] Overall action history (for easy reversal of changes)

- [ ] **Lineage** (only if theres enough demand)

- [ ] **Admin Page**