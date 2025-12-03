# Web Application

The main Next.js web application for thedev.tools. Provides a user-friendly interface for accessing all developer tools and utilities.

## Overview

This is a Next.js 15 application built with:

- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Fuse.js** for search functionality

## Features

- 🎨 Modern, responsive UI
- 🔍 Powerful search with fuzzy matching
- 🌙 Dark mode support
- 📱 Mobile-friendly design
- ⚡ Fast page loads with Next.js optimizations
- 🎯 100+ developer tools organized by category

## Getting Started

### Development

```bash
# From the monorepo root
pnpm dev

# Or from this directory
cd apps/web
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── tools/             # Tool pages (dynamic routes)
├── components/            # React components
│   └── providers.tsx      # Context providers
├── constants/             # App-specific constants
│   └── tools.ts           # Tool constants re-exports
├── hooks/                 # Custom React hooks
├── lib/                   # Library code
│   └── tools/             # Tool-related utilities
│       ├── tools.ts       # Tool definitions
│       ├── search.ts      # Search functionality
│       ├── tool-display.ts # Display utilities
│       ├── tool-icons.ts  # Icon mappings
│       └── tool-utils.ts  # Helper functions
└── types/                 # TypeScript types
```

## Tool Categories

Tools are organized into the following categories:

- **Code** - HTML, CSS, JavaScript utilities
- **Formatters** - JSON, XML, YAML, SQL formatters
- **Frontend** - Color tools, CSS generators, design utilities
- **Backend** - JWT, hashing, UUID generators
- **Content** - Markdown, Lorem Ipsum, slug generators
- **SEO** - Meta tags, robots.txt, sitemap generators
- **Developer** - Git, env, license generators
- **Accessibility** - ARIA generators, semantic HTML checkers
- **Document** - PDF, DOCX converters
- **Multimedia** - Image, video, audio tools
- **API** - HTTP utilities, webhook formatters

## Adding a New Tool

1. **Define the tool** in `lib/tools/tools.ts`:

```typescript
{
  slug: "my-new-tool",
  name: "My New Tool",
  description: "Description of what the tool does",
  category: "formatters",
  path: "/tools/formatters/my-new-tool",
  tags: ["tag1", "tag2"],
  action: "format",
  packages: []
}
```

2. **Create the tool page** in `app/tools/[category]/[tool]/page.tsx`

3. **Implement the functionality** using functions from `@workspace/utilities`

4. **Add icon** in `lib/tools/tool-icons.ts` if needed

## Dependencies

### Workspace Packages

- `@workspace/ui` - shadcn/ui component library
- `@workspace/utilities` - Core utility functions
- `@workspace/constants` - Shared constants
- `@workspace/types` - TypeScript types

### External Dependencies

- `next` - Next.js framework
- `react` & `react-dom` - React library
- `fuse.js` - Fuzzy search
- `lucide-react` - Icon library
- `next-themes` - Theme management
- `tailwindcss` - CSS framework

## Configuration

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Add your environment variables here
```

### Next.js Config

Configuration is in `next.config.mjs`. The app uses:

- Turbopack for faster development
- TypeScript strict mode
- Path aliases for clean imports

## Styling

The app uses Tailwind CSS for styling. Configuration is in:

- `postcss.config.mjs` - PostCSS configuration
- `app/globals.css` - Global styles and Tailwind directives

## Search

Search functionality is powered by Fuse.js and configured in:

- `lib/tools/search.ts` - Search implementation
- `@workspace/constants/tools` - Search configuration

## License

MIT
