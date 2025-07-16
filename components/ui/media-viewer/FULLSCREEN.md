# Fullscreen Mode - Distraction-Free Viewing

## Overview

The fullscreen mode feature provides a distraction-free viewing experience for the media viewer, similar to professional photography applications like Lightroom. It offers multiple viewing modes with adaptive UI controls.

## Features

### 🎯 **Three Fullscreen Modes**

1. **Normal Mode** - Full interface with all controls visible
2. **Distraction-Free Mode** - Minimal interface with auto-hiding controls
3. **Minimal Mode** - Ultra-clean interface with only essential navigation

### 🎮 **Keyboard Shortcuts**

| Key     | Action                                         |
| ------- | ---------------------------------------------- |
| `F`     | Toggle fullscreen                              |
| `D`     | Toggle distraction-free mode                   |
| `M`     | Cycle through fullscreen modes                 |
| `ESC`   | Exit fullscreen (priority over closing viewer) |
| `←` `→` | Navigate images                                |

### 🖱️ **Smart Auto-Hide**

- **Distraction-Free Mode**: Controls auto-hide after 3 seconds of inactivity
- **Mouse Movement**: Shows controls instantly on mouse movement
- **Touch Support**: Shows controls on touch interaction

### 📱 **Responsive Design**

- **Desktop**: Full keyboard shortcuts and mouse interactions
- **Mobile**: Touch-friendly controls and gestures
- **Tablet**: Optimized for touch and stylus input

## Implementation Details

### Components

#### `FullscreenOverlay`

- Manages fullscreen UI overlay
- Handles auto-hide logic
- Provides mode switching controls
- Keyboard shortcut handling

#### `MediaViewerContext` (Enhanced)

- `isFullscreen`: Boolean state
- `isDistractionFree`: Boolean state
- `fullscreenMode`: 'normal' | 'distraction-free' | 'minimal'
- `handleFullscreen()`: Toggle fullscreen
- `handleDistractionFreeToggle()`: Toggle distraction-free mode
- `handleFullscreenModeChange()`: Change fullscreen mode
- `exitFullscreen()`: Exit fullscreen completely

#### `MediaViewer` (Enhanced)

- Conditional rendering based on fullscreen state
- Separate fullscreen container outside Dialog
- Mode-specific component visibility

### State Management

```typescript
const [isFullscreen, setIsFullscreen] = useState(false);
const [isDistractionFree, setIsDistractionFree] = useState(false);
const [fullscreenMode, setFullscreenMode] = useState<'normal' | 'distraction-free' | 'minimal'>(
  'normal',
);
```

### Event Listeners

- `fullscreenchange`: Detects system fullscreen changes
- `webkitfullscreenchange`: Safari support
- `mozfullscreenchange`: Firefox support
- `MSFullscreenChange`: Edge support

## Usage Examples

### Basic Fullscreen

```typescript
const viewer = useMediaViewerContext();

// Enter fullscreen
viewer.handleFullscreen();

// Exit fullscreen
viewer.exitFullscreen();
```

### Distraction-Free Mode

```typescript
// Toggle distraction-free mode
viewer.handleDistractionFreeToggle();

// Set specific mode
viewer.handleFullscreenModeChange('distraction-free');
```

### Fullscreen State Checking

```typescript
if (viewer.isFullscreen) {
  // Fullscreen-specific logic
}

if (viewer.isDistractionFree) {
  // Hide additional UI elements
}
```

## Visual Modes

### Normal Mode

- Full header with all controls
- Side navigation buttons
- Bottom status bar with shortcuts
- Filmstrip visible
- Metadata panel visible
- Feature panels visible

### Distraction-Free Mode

- Auto-hiding controls (3s timeout)
- Side navigation visible
- Minimal status indicators
- Clean background
- Focus on image content

### Minimal Mode

- Ultra-clean interface
- No side navigation
- Only center position indicator
- Maximum focus on image
- Touch/click to reveal controls

## Cross-Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support with `moz` prefix
- **Safari**: Full support with `webkit` prefix
- **Mobile Safari**: iOS fullscreen API
- **Chrome Mobile**: Android fullscreen API

## Performance Optimizations

- **Lazy Control Rendering**: Controls only render when visible
- **Event Debouncing**: Mouse movement events are debounced
- **Memory Management**: Proper cleanup of timeouts and listeners
- **Conditional Rendering**: Components only render in appropriate modes

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Focus Management**: Maintained focus states
- **High Contrast**: Works with system themes

## Integration with Existing Features

- **Gesture Controls**: All gestures work in fullscreen
- **Slideshow**: Continues in fullscreen mode
- **Comparison View**: Available in normal mode
- **Rating System**: Available in normal mode
- **Quick Actions**: Available in normal mode
- **Histogram**: Available in normal mode

## Professional Photography Workflow

### Lightroom-Style Experience

1. **Enter Fullscreen**: Press `F` for distraction-free viewing
2. **Image Assessment**: Use distraction-free mode for critical evaluation
3. **Quick Rating**: Use keyboard shortcuts for rating
4. **Comparison**: Switch to normal mode for side-by-side comparison
5. **Batch Processing**: Use minimal mode for quick culling

### Workflow Integration

- **Culling**: Minimal mode for fast image selection
- **Editing**: Normal mode for detailed work
- **Presentation**: Distraction-free mode for client reviews
- **Portfolio Review**: Slideshow with fullscreen mode

## Future Enhancements

- **Picture-in-Picture**: Floating window support
- **Multi-Monitor**: Extended desktop support
- **VR Mode**: Virtual reality viewing
- **Presentation Mode**: Automated slideshow controls
- **Kiosk Mode**: Public display optimization

## Migration Guide

### From Previous Version

1. Existing fullscreen functionality is preserved
2. New modes are additive enhancements
3. Keyboard shortcuts are backwards compatible
4. No breaking changes to existing API

### Configuration

No additional configuration required - works out of the box with sensible defaults.

## Testing

### Manual Testing

1. **Fullscreen Toggle**: Test F key and button
2. **Mode Switching**: Test M key and mode buttons
3. **Auto-Hide**: Test distraction-free mode timeout
4. **Keyboard Navigation**: Test all shortcuts
5. **Touch Interaction**: Test mobile gestures

### Automated Testing

- Unit tests for fullscreen state management
- Integration tests for keyboard shortcuts
- E2E tests for mode transitions
- Performance tests for auto-hide logic

## Troubleshooting

### Common Issues

**Fullscreen not working**

- Check browser fullscreen permissions
- Ensure user gesture initiated the request
- Verify browser support for Fullscreen API

**Controls not hiding**

- Check distraction-free mode is enabled
- Verify timeout is not being reset
- Ensure mouse is not moving

**Keyboard shortcuts not working**

- Check focus is on media viewer
- Verify no other elements are capturing keydown
- Ensure fullscreen mode is active

### Browser Compatibility

**Safari Issues**

- Use `webkitRequestFullscreen()` for older versions
- Handle `webkitfullscreenchange` events

**Firefox Issues**

- Use `mozRequestFullScreen()` for older versions
- Handle `mozfullscreenchange` events

**Mobile Issues**

- iOS Safari requires user gesture
- Android Chrome may have different behavior
- Test on actual devices, not just simulators
