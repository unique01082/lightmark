# Copilot Instructions for Lightmark

## Project Overview

Lightmark is a Next.js 15 photography note-taking application with a sophisticated media viewer system. It uses React 19, TypeScript, Tailwind CSS, use lodash and ahooks whenever possible and integrates with Directus CMS for content management and storage.

## Architecture Patterns

### Route Organization

- **App Router**: Uses Next.js 15 app directory structure
- **Route Groups**: `(auth)` for authentication pages, `(global)` for main application
- **Server/Client Components**: Clear separation - forms and interactive components use `"use client"`

### UI Component System

- **Base**: Radix UI primitives with custom Tailwind styling in `/components/ui/` for shared components used across the app
- **Composition**: Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- **Theming**: Dark mode default via `next-themes` with CSS variables in globals.css

### State Management Pattern

The MediaViewer exemplifies the app's context architecture with feature-based contexts:

```typescript
// Feature-based context split (not monolithic)
useMediaViewerCore(); // Essential image/navigation
useMediaViewerZoom(); // Zoom functionality
useMediaViewerFavorites(); // Favorites management
```

Context providers stack with enable/disable flags:

```typescript
<MediaViewerCoreProvider>
  <MediaViewerZoomProvider enabled={enableZoom}>
    <MediaViewerFavoritesProvider enabled={enableFavorites}>
      <Content />
```

## Development Workflow

### Local Development

```bash
pnpm run dev -p 2244  # Runs on port 2244 (not 3000)
```

### Build Configuration

- **TypeScript**: Build errors ignored (`ignoreBuildErrors: true`)
- **ESLint**: Linting ignored during builds
- **Images**: Unoptimized for development
- **React**: Strict mode disabled

### Service Integration

- **Directus**: Primary CMS via `@directus/sdk` - see `lib/directus.ts`

## Code Conventions

### Component Patterns

1. **Form Components**: Use controlled state or react-hook-form
   - Controlled components for simple forms
   - Use `react-hook-form` for complex forms with validation
2. **Dialog/Modal**: Radix Dialog with `isOpen` prop pattern
3. **Loading States**: Skeleton components preferred over spinners
4. **Error Handling**: Custom `ValidationError` class in `lib/validation.ts`
5. **Library Components**: Use shadcn/ui components for consistency, avoiding custom implementations unless necessary. Use ahooks whenever possible, especially for hooks that enhance performance or simplify logic or state management (prefer `useReactive`) or `useRequest` for request handling.

### Data Flow

- **Types**: Central type definitions in `lib/types.ts`
- **Mock Data**: Development data in `lib/mock-data.ts`
- **Validation**: Custom validation functions, not Zod schemas
- **API**: Directus collections defined in `DIRECTUS_COLLECTIONS` constant

### File Organization

```
Put everything that is only relevant to the page right on that page in the folder start with underscore. For example components (./_components/), context (./_context/), hooks (./_hooks/), utils (./_utils/),...
```

```
Try to make sure there are enough files that Next.js supports:
The components defined in special files are rendered in a specific hierarchy:

layout.js (Page layout)
template.js
error.js (React error boundary)
loading.js (React suspense boundary)
not-found.js (React error boundary)
page.js or nested layout.js
```

- **lib/**: Core utilities, types, and service integrations
- **components/ui/**: Reusable UI components (shadcn/ui based) shared across the app
- **components/forms/**: Form-specific components shared across the app
- **app/**: Next.js app router pages and layouts

## Key Integration Points

### MediaViewer System

Recently refactored from monolithic to feature-based contexts. When extending:

- Create new context in `components/ui/media-viewer/contexts/`
- Add enable/disable prop to `MediaViewerProps`
- Stack provider in `media-viewer-new.tsx`

### Data Management

- **DataType**: Defines custom field structures
- **DataItem**: Instances of DataTypes with field values
- **Albums/Photos**: Media organization structures
- Use `lib/directus.ts` functions for CRUD operations

### Custom Fields System

Dynamic form rendering based on field types:

- `string`, `number`, `link`, `datetime`, `image`, `video`, `file`
- `tags`, `dropdown`, `radio`, `multiple-dropdown`
- Rendered via `DynamicFieldRenderer` component

## Performance Considerations

- Images are unoptimized (development setup)
- React strict mode disabled for compatibility
- Context providers only active when enabled
- Lazy loading implemented in MediaViewer components
