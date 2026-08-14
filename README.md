# SkillGraph — Career Intelligence Explorer

**Phase 3 Implementation Complete**

A Next.js application that provides a premium developer-focused career intelligence interface for exploring relationships between roles, skills, technologies, and projects.

## Features

### Core Pages
- **Landing Page (`/`)** - Hero section with role explorer, search, and category filtering
- **Role Detail (`/roles/[slug]`)** - Complete role information with skills grouped by importance, technologies, related roles, and comparison actions
- **Skill Detail (`/skills/[slug]`)** - Skill information with connected technologies, projects, learning resources, and prerequisite chains
- **Compare (`/compare`)** - Side-by-side role comparison showing shared and unique skills
- **Explore (`/explore`)** - Technology popularity across roles

### Component Architecture
- **Header** - Responsive navigation with mobile menu
- **RoleCard** - Role preview cards with metadata
- **RoleExplorer** - Search and filter interface for roles
- **Badge** - Semantic type-based badges (role, skill, tech, project, resource)
- **Skeleton** - Loading states
- **EmptyState** - Empty data states
- **ErrorBanner** - Error messaging
- **SectionHeader** - Consistent section headers

### Design System
- Dark-first color scheme optimized for developer focus
- Consistent semantic colors for node types (roles, skills, technologies, projects, resources)
- Typography hierarchy with proper spacing
- Responsive design (mobile, tablet, desktop)
- Accessible focus states and keyboard navigation

## Technology Stack

- **Next.js 16.3.0** - App Router with Server Components
- **TypeScript** - Strict type safety
- **Neo4j** - Graph database via official driver
- **Zod** - Schema validation
- **CSS Modules** - Component-scoped styling

## Prerequisites

- Node.js 20+
- Neo4j/CognoDB database instance
- Database credentials

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure database**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your CognoDB credentials:
   ```
   COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
   COGNODB_USER=cognodb
   COGNODB_PASSWORD=your_password
   ```

3. **Seed the database** (if needed)
   ```bash
   npx tsx scripts/seed.ts
   ```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```

**Note:** Production build requires valid CognoDB credentials as Next.js pre-renders pages at build time.

## Type Checking

```bash
npx tsc --noEmit
```

## Linting

```bash
npm run lint
```

## Project Structure

```
skillgraph/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── roles/        # GET all roles
│   │   │   └── compare/      # GET role comparison
│   │   ├── compare/          # Compare page
│   │   ├── explore/          # Explore technologies page
│   │   ├── roles/[slug]/     # Role detail page
│   │   ├── skills/[slug]/    # Skill detail page
│   │   ├── layout.tsx        # Root layout with Header
│   │   ├── page.tsx          # Landing page
│   │   ├── not-found.tsx     # Global 404
│   │   ├── error.tsx         # Global error boundary
│   │   └── globals.css       # Design system & global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Badge
│   │   │   ├── EmptyState
│   │   │   ├── ErrorBanner
│   │   │   ├── SectionHeader
│   │   │   └── Skeleton
│   │   ├── Header            # App navigation
│   │   ├── RoleCard          # Role preview card
│   │   ├── RoleExplorer      # Role search/filter
│   │   └── RoleGrid          # Role card grid
│   └── lib/
│       ├── neo4j.ts          # Database connection
│       ├── queries.ts        # Centralized Cypher queries
│       ├── schemas.ts        # Zod validation schemas
│       ├── types.ts          # TypeScript domain types
│       └── utils.ts          # Helper functions
├── scripts/
│   ├── seed.ts               # Database seeding script
│   └── seed-data.ts          # Seed data
├── .env.example              # Environment template
└── package.json
```

## Data Layer

All database queries are centralized in `src/lib/queries.ts`:

- `getAllRoles()` - Q1: All roles for landing page
- `getRoleDetail(slug)` - Q2: Role with skills and technologies
- `getSkillTechProjects(slug)` - Q3: Multi-hop traversal
- `getSharedSkills(slug1, slug2)` - Q4: Shared skills between roles
- `getRelatedRoles(slug)` - Q5: Related roles by skill overlap
- `getSkillPrerequisites(slug)` - Q6: Skill prerequisite chains
- `getRoleSubgraph(slug)` - Q7: Graph data (for Phase 4)
- `getTechPopularity()` - Q8: Technology popularity
- `getSkillDetail(slug)` - Skill detail with connections

## Phase 3 Status

✅ **Complete** - All required pages, components, and features implemented
✅ **TypeScript** - All files pass strict type checking
✅ **Responsive** - Mobile, tablet, and desktop layouts
✅ **Accessible** - Semantic HTML, keyboard navigation, focus states
✅ **Loading States** - Skeletons for all async content
✅ **Empty States** - Meaningful messages for missing data
✅ **Error States** - User-friendly error handling
✅ **Server Components** - Optimal performance with minimal client JS
✅ **Design System** - Consistent dark-first premium aesthetic

## Phase 4 Preparation

The codebase is ready for Phase 4 force-directed graph implementation:

- Graph placeholder component in role detail page
- `getRoleSubgraph()` query already implemented
- Consistent semantic colors for graph nodes
- Graph API route structure established

## Architecture Decisions

### Server vs Client Components
- **Server Components**: All pages, data fetching
- **Client Components**: Header (navigation state), RoleExplorer (search/filter), Compare page (URL state management)

### Styling Approach
- CSS Modules for component-scoped styles
- CSS variables for design tokens
- No CSS-in-JS or heavy UI frameworks
- Mobile-first responsive design

### State Management
- URL search parameters for shareable state (compare, filters)
- No global state library needed
- Server Components handle most data

### Error Handling
- Try/catch at page level
- User-friendly error messages
- Database errors never exposed to users
- Proper HTTP status codes

## Known Limitations

- Production build requires valid database credentials (by design)
- Compare page uses client-side API routes (intentional for URL state)
- Graph visualization placeholder (Phase 4)

## Contributing

This is a take-home assignment implementation. For production use, consider:
- Adding request caching/revalidation strategies
- Implementing rate limiting on API routes
- Adding telemetry and error tracking
- Database query optimization for large datasets
- Adding tests (unit, integration, e2e)

## License

MIT
