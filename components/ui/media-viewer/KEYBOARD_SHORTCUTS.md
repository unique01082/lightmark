# Enhanced Keyboard Shortcuts - Comprehensive Navigation

## Overview

The enhanced keyboard shortcuts system provides comprehensive keyboard navigation for the media viewer, enabling professional-grade workflow efficiency similar to desktop photo management applications like Lightroom, Capture One, and Photo Mechanic.

## 🎯 **Key Features**

### **Professional Photography Workflow**

- **Star Ratings**: 1-5 for quick image rating
- **Color Labels**: 6-9 for visual organization
- **Pick/Reject Flags**: P/X for culling workflow
- **Batch Operations**: Ctrl+Shift combinations for bulk actions

### **Advanced Navigation**

- **Precise Movement**: Arrow keys, Page Up/Down, Home/End
- **Jump Navigation**: Ctrl+Home/End for instant positioning
- **Selection Controls**: Ctrl+A, Ctrl+Shift+A, Ctrl+I for bulk selection

### **Comprehensive Zoom Controls**

- **Standard Zoom**: +/- keys for basic zoom
- **Precision Zoom**: Ctrl+/- for fine control
- **Fit Modes**: Multiple fit options (fit, fill, actual size)
- **Quick Zoom**: Single-key shortcuts for common zoom levels

### **File Operations**

- **Standard Operations**: Copy, paste, delete, rename
- **Professional Actions**: Export, duplicate, share
- **Batch Processing**: Multi-image operations

## 📋 **Complete Shortcut Reference**

### **Navigation & Movement**

```
←/→             Previous/Next image
Page Up/Down    Jump 10 images
Home/End        First/Last image
Ctrl+Home/End   Jump to absolute first/last
```

### **Zoom & View Control**

```
+/=             Zoom in
-               Zoom out
Ctrl++/-        Precision zoom
Ctrl+0          Zoom to fit
Ctrl+Alt+0      Actual size (100%)
Ctrl+Shift+0    Zoom to fill
Z               Quick zoom to fit
Shift+Z         Quick zoom to fill
```

### **Image Transformation**

```
R               Rotate 90° clockwise
Ctrl+R          Rotate right
Ctrl+Shift+R    Rotate left
Ctrl+]          Rotate right (alternative)
Ctrl+[          Rotate left (alternative)
Ctrl+Shift+H    Flip horizontal
Ctrl+Shift+V    Flip vertical
C               Crop tool
```

### **Rating & Selection**

```
1-5             Set star rating
0               Clear rating
B               Toggle bookmark/favorite
P               Toggle pick flag
X               Toggle reject flag
T               Toggle rating panel
```

### **Color Labels (Professional Workflow)**

```
6               Red label
7               Orange label
8               Yellow label
9               Green label
Shift+6         Blue label
Shift+7         Purple label
Shift+8         Pink label
Shift+9         Gray label
```

### **File Operations**

```
Delete          Delete current image
Backspace       Delete current image (alternative)
Ctrl+C          Copy image
Ctrl+V          Paste image
Ctrl+D          Duplicate image
Ctrl+S          Share image
Ctrl+E          Export image
F2              Rename image
E               Edit image
```

### **View & Display**

```
F               Toggle fullscreen
D               Toggle distraction-free mode
M               Cycle fullscreen modes
Esc             Exit fullscreen/Close viewer
H               Toggle histogram
G               Toggle grid overlay
I               Toggle info panel
Q               Toggle quick actions
V               Toggle comparison view
S               Toggle slideshow
Space           Play/pause slideshow
```

### **Selection & Batch Operations**

```
Ctrl+A          Select all images
Ctrl+Shift+A    Deselect all
Ctrl+I          Invert selection
Ctrl+Shift+B    Batch favorite selected
Ctrl+Shift+D    Batch delete selected
Ctrl+Shift+E    Batch export selected
```

### **Advanced View Controls**

```
Ctrl+Shift+F    Toggle filmstrip
Ctrl+Shift+M    Toggle metadata panel
Ctrl+Shift+T    Toggle thumbnails
Ctrl+Shift+F    Toggle focus indicators
Ctrl+Shift+E    Toggle exposure warnings
Ctrl+Shift+C    Toggle clipping warnings
Ctrl+Shift+R    Toggle ruler/measurements
Ctrl+Shift+G    Toggle composition guides
```

### **Search & Organization**

```
Ctrl+F          Search/find images
Ctrl+Shift+L    Toggle filter panel
Ctrl+Shift+S    Toggle sort options
```

### **Performance & System**

```
F5              Refresh current view
Ctrl+Shift+Del  Clear image cache
Ctrl+Shift+→    Preload next images
Ctrl+Shift+←    Preload previous images
```

### **Help & Assistance**

```
Ctrl+?          Show keyboard shortcuts help
F1              Show help dialog
```

## 🔧 **Implementation Details**

### **Hook Architecture**

```typescript
interface UseMediaViewerKeyboardProps {
  // Core navigation
  isOpen: boolean;
  currentIndex: number;
  imagesLength: number;

  // Enhanced navigation
  onJumpToIndex?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onInvertSelection?: () => void;

  // Zoom controls
  onZoomToFit?: () => void;
  onZoomToFill?: () => void;
  onZoomActualSize?: () => void;
  onZoomReset?: () => void;

  // Professional features
  onColorLabel?: (color: string) => void;
  onBatchFavorite?: () => void;
  onBatchDelete?: () => void;
  onBatchExport?: () => void;
}
```

### **Context Integration**

- All shortcuts are integrated into the `MediaViewerContext`
- State management for help dialog visibility
- Professional workflow state tracking
- Batch operation status management

### **Professional Workflow Support**

- **Lightroom-Style**: Familiar shortcuts for professional photographers
- **Batch Processing**: Efficient multi-image operations
- **Color Coding**: Visual organization with color labels
- **Rating System**: Standard 5-star rating with pick/reject flags

## 🎨 **Help System**

### **Interactive Help Dialog**

- **Grouped by Function**: Shortcuts organized by purpose
- **Visual Keys**: Keyboard key representations
- **Mac Support**: Automatic platform-specific key display
- **Searchable**: Find shortcuts by function
- **Contextual**: Shows relevant shortcuts based on current mode

### **Help Dialog Features**

- **Sidebar Navigation**: Quick access to specific categories
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Matches system theme
- **Keyboard Accessible**: Fully navigable with keyboard

## 🚀 **Performance Optimizations**

### **Efficient Key Handling**

- **Event Delegation**: Minimal event listener overhead
- **Debounced Actions**: Prevents rapid-fire key presses
- **Conditional Execution**: Only active when viewer is open
- **Memory Management**: Proper cleanup of event listeners

### **Smart Preloading**

- **Predictive Loading**: Preload based on navigation patterns
- **Cache Management**: Intelligent cache clearing
- **Background Processing**: Non-blocking operations

## 🔄 **Integration with Existing Features**

### **Gesture Compatibility**

- All keyboard shortcuts work alongside touch/mouse gestures
- No conflicts with existing interaction methods
- Enhanced accessibility for keyboard-only users

### **Fullscreen Integration**

- Shortcuts work in all fullscreen modes
- Mode-specific behavior for distraction-free viewing
- Escape key prioritizes fullscreen exit

### **Feature Panel Integration**

- Shortcuts toggle all feature panels
- Quick access to histogram, ratings, quick actions
- Consistent behavior across all UI components

## 🎯 **Professional Use Cases**

### **Wedding Photography Workflow**

1. **Import**: Ctrl+Shift+← to preload batch
2. **Culling**: P/X for pick/reject, arrow keys for navigation
3. **Rating**: 1-5 for quality rating
4. **Color Coding**: 6-9 for delivery categories
5. **Export**: Ctrl+Shift+E for batch export

### **Portrait Session Review**

1. **Fullscreen**: F for distraction-free viewing
2. **Comparison**: V for side-by-side comparison
3. **Detailed Review**: H for histogram, G for grid
4. **Client Selection**: B for favorites, color labels for categories

### **Landscape Photography Organization**

1. **Quick Sort**: Star ratings for keeper selection
2. **Seasonal Organization**: Color labels for time periods
3. **Location Tagging**: Metadata panel for GPS info
4. **Export Preparation**: Batch operations for processing

## 📱 **Mobile & Touch Support**

### **Touch-Friendly Alternatives**

- Long press for context menus
- Swipe gestures for navigation
- Touch targets for all interactive elements
- Haptic feedback on supported devices

### **Adaptive Interface**

- Keyboard shortcuts available when external keyboard connected
- Touch-optimized help dialog
- Responsive layout adjustments

## 🔧 **Customization Options**

### **Configurable Shortcuts**

- User-defined key mappings
- Plugin system for custom shortcuts
- Export/import shortcut configurations
- Conflict detection and resolution

### **Professional Presets**

- Lightroom-style shortcuts
- Capture One compatibility
- Photo Mechanic workflow
- Custom studio workflows

## 🐛 **Troubleshooting**

### **Common Issues**

- **Shortcuts Not Working**: Check if viewer has focus
- **Conflicts with Browser**: Some shortcuts may be overridden
- **Performance Issues**: Clear cache with Ctrl+Shift+Del
- **Help Dialog**: Press Ctrl+? or F1 for assistance

### **Browser Compatibility**

- **Chrome**: Full support for all shortcuts
- **Firefox**: Full support with minor key display differences
- **Safari**: Most shortcuts supported, some Mac-specific variations
- **Edge**: Full support with Windows-specific behavior

## 🚀 **Future Enhancements**

### **Planned Features**

- **Custom Shortcut Recording**: User-defined macro recording
- **Voice Commands**: Voice-activated shortcuts
- **Gesture Learning**: AI-powered gesture recognition
- **Multi-Display**: Extended keyboard support for multiple monitors

### **Professional Integrations**

- **Lightroom Plugin**: Direct integration with Adobe Lightroom
- **Capture One Bridge**: Seamless workflow integration
- **Camera Tethering**: Live view keyboard controls
- **Print Studio**: Direct-to-print shortcuts

The enhanced keyboard shortcuts system transforms the media viewer into a professional-grade tool that rivals desktop photo management applications while maintaining the accessibility and ease of use of a web-based interface.
