# MediaViewer Context Refactoring Summary

## Overview

Successfully refactored the monolithic `media-viewer-context.tsx` into multiple feature-based contexts for better maintainability and configurability.

## New Context Structure

### Core Contexts

1. **CoreContext** (`contexts/core-context.tsx`)
   - Essential image and navigation state
   - Image loading, rotation, navigation handlers
   - Foundation for all other contexts

2. **UIStateContext** (`contexts/ui-state-context.tsx`)
   - UI state management (transitions, overlays, loading, errors)
   - Mouse interaction handlers
   - Tool state management

3. **ZoomContext** (`contexts/zoom-context.tsx`)
   - Zoom and pan state
   - Zoom calculations and utilities
   - Zoom event handlers

### Feature Contexts

4. **SlideshowContext** (`contexts/slideshow-context.tsx`)
   - Slideshow state and controls
   - Auto-advance functionality
   - Slideshow configuration

5. **FavoritesContext** (`contexts/favorites-context.tsx`)
   - Favorites management
   - Add/remove favorites
   - Favorite state queries

6. **RatingsContext** (`contexts/ratings-context.tsx`)
   - Image rating system (1-5 stars)
   - Rating statistics
   - Rating management

7. **KeyboardContext** (`contexts/keyboard-context.tsx`)
   - Keyboard shortcuts
   - Key event handling
   - Custom shortcut support

8. **CropContext** (`contexts/crop-context.tsx`)
   - Crop simulation functionality
   - Crop area management
   - Crop settings and utilities

## Usage

### Basic Usage

```typescript
import { MediaViewer } from './components/ui/media-viewer/media-viewer-new';

<MediaViewer
  images={images}
  currentIndex={0}
  isOpen={true}
  onClose={handleClose}
  onIndexChange={handleIndexChange}
  metadata={metadata}
/>
```

### Feature Configuration

```typescript
<MediaViewer
  images={images}
  currentIndex={0}
  isOpen={true}
  onClose={handleClose}
  onIndexChange={handleIndexChange}
  metadata={metadata}

  // Enable/disable features
  enableZoom={true}
  enableSlideshow={true}
  enableFavorites={true}
  enableRatings={true}
  enableKeyboardShortcuts={true}
  enableCrop={true}
  enableFullscreen={true}
  enableGestures={true}
  enableUIState={true}

  // Feature configuration
  initialFavorites={['image1.jpg', 'image2.jpg']}
  initialRatings={{ 'image1.jpg': 5, 'image2.jpg': 3 }}
  maxRating={5}
  slideshowInterval={3000}
  customKeyboardShortcuts={[
    {
      key: 'f',
      action: () => console.log('Custom shortcut'),
      description: 'Custom action'
    }
  ]}
/>
```

### Using Individual Contexts

```typescript
import { useMediaViewerCore, useMediaViewerZoom, useMediaViewerFavorites } from './contexts';

function MyComponent() {
  const { images, currentIndex, handleNext } = useMediaViewerCore();
  const { zoom, handleZoomIn } = useMediaViewerZoom();
  const { favorites, handleToggleFavorite } = useMediaViewerFavorites();

  // Use context values...
}
```

## Benefits

1. **Modularity**: Each context handles a specific feature area
2. **Configurability**: Parent components can enable/disable features
3. **Performance**: Only enabled contexts are active
4. **Maintainability**: Easier to update individual features
5. **Reusability**: Contexts can be used independently
6. **Type Safety**: Full TypeScript support with proper interfaces

## Files Created

- `contexts/core-context.tsx` - Core functionality
- `contexts/ui-state-context.tsx` - UI state management
- `contexts/zoom-context.tsx` - Zoom functionality
- `contexts/slideshow-context.tsx` - Slideshow features
- `contexts/favorites-context.tsx` - Favorites management
- `contexts/ratings-context.tsx` - Rating system
- `contexts/keyboard-context.tsx` - Keyboard shortcuts
- `contexts/crop-context.tsx` - Crop simulator
- `contexts/index.ts` - Context exports
- `media-viewer-new.tsx` - Updated MediaViewer component
- Updated `types.ts` - New prop interfaces

## Migration Guide

To migrate from the old MediaViewer to the new one:

1. Replace import: `import { MediaViewer } from './media-viewer-new'`
2. Add feature props as needed
3. Update any custom context usage to use new context hooks
4. Test each feature individually with enable/disable flags

The new system provides much better control over MediaViewer functionality while maintaining full backward compatibility through sensible defaults.
