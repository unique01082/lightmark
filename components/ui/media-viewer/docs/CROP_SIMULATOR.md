# Crop Simulator Feature

## Overview

The Crop Simulator is a comprehensive image cropping tool that allows users to simulate crop operations with various aspect ratio presets. This feature provides professional-grade cropping capabilities with real-time preview and precise control.

## Features

### 🎯 **Aspect Ratio Presets**

- **Free** - No constraints for freeform cropping
- **1:1** - Perfect square format
- **4:3** - Standard display ratio
- **3:2** - Traditional camera ratio
- **16:9** - Widescreen/video format
- **9:16** - Vertical/story format
- **2:3** - Portrait orientation
- **3:4** - Portrait orientation
- **21:9** - Cinematic widescreen
- **5:4** - Classic computer monitor

### 🛠️ **Interactive Controls**

- **Drag to Move** - Click and drag the crop area to reposition
- **Resize Handle** - Use the bottom-right corner handle to resize
- **Grid Overlay** - Toggle rule-of-thirds grid for better composition
- **Dimension Display** - Show actual pixel dimensions in real-time
- **Transform Tools** - Rotate, flip horizontal/vertical

### 📐 **Precise Measurements**

- **Real-time Dimensions** - Shows actual pixel dimensions
- **Position Tracking** - Displays exact X,Y coordinates
- **Aspect Ratio Locking** - Maintains proportions when selected
- **Scale Calculation** - Automatically calculates from display to actual size

### 🎨 **Visual Aids**

- **Dark Overlay** - Dims non-cropped areas
- **Composition Grid** - Rule of thirds guideline
- **Dimension Tooltip** - Shows crop size in pixels
- **Preview Border** - White border around crop area
- **Corner Handles** - Visual resize indicators

## Usage

### Opening the Crop Simulator

1. **Keyboard Shortcut**: Press `C` while viewing an image
2. **Menu Access**: Use the crop tool from the toolbar
3. **Context Menu**: Right-click and select "Crop"

### Basic Cropping Workflow

1. **Select Aspect Ratio**: Choose from preset ratios or use "Free" mode
2. **Position Crop Area**: Click and drag to move the crop region
3. **Resize**: Use the corner handle to adjust size
4. **Fine-tune**: Enable grid for better composition
5. **Apply**: Click "Apply Crop" to confirm changes

### Advanced Features

- **Transform**: Rotate or flip the image before cropping
- **Grid Toggle**: Use composition guidelines
- **Dimension Lock**: Maintain specific proportions
- **Reset**: Quickly return to default settings

## Technical Implementation

### Component Structure

```typescript
interface CropSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropApply?: (cropArea: CropArea) => void;
  onCropCancel?: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}
```

### State Management

- **Crop Area**: Position and size of the crop region
- **Aspect Ratio**: Current preset or free mode
- **Visual Options**: Grid, dimensions, transform settings
- **Image Properties**: Natural and display dimensions

### Calculation System

- **Scale Factor**: Converts display coordinates to actual pixels
- **Aspect Ratio Enforcement**: Maintains proportions when preset is selected
- **Boundary Checking**: Ensures crop area stays within image bounds
- **Real-time Updates**: Instant feedback on all changes

## Integration with Media Viewer

### Context Integration

The crop simulator is fully integrated with the media viewer context:

- **State Management**: Managed through `MediaViewerContext`
- **Keyboard Shortcuts**: Accessible via `C` key
- **Theme Consistency**: Matches media viewer styling
- **Responsive Design**: Works on all screen sizes

### Keyboard Shortcuts

- **C** - Open/close crop simulator
- **Escape** - Cancel cropping
- **Enter** - Apply crop
- **R** - Rotate image
- **H** - Flip horizontal
- **V** - Flip vertical
- **G** - Toggle grid
- **D** - Toggle dimensions

## User Experience

### Visual Feedback

- **Immediate Response**: Real-time preview updates
- **Clear Indicators**: Visual cues for all interactions
- **Smooth Animations**: Fluid transitions and hover effects
- **Consistent Styling**: Matches overall application theme

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **High Contrast**: Clear visual distinction between elements
- **Focus Management**: Logical tab order and focus indicators

## Professional Workflow

### Photography Standards

- **Industry Ratios**: Common photography aspect ratios
- **Composition Tools**: Rule of thirds grid overlay
- **Precise Control**: Pixel-perfect positioning
- **Non-destructive**: Simulation mode preserves original

### Batch Processing Ready

- **Consistent Ratios**: Apply same aspect ratio to multiple images
- **Quick Workflow**: Efficient tools for rapid editing
- **Export Ready**: Proper dimensions for various platforms
- **Quality Preservation**: Maintains image quality standards

## Performance Considerations

### Optimization

- **Efficient Rendering**: Optimized DOM updates
- **Memory Management**: Proper cleanup of resources
- **Responsive Updates**: Debounced real-time calculations
- **Smooth Interactions**: Hardware-accelerated transforms

### Browser Compatibility

- **Cross-browser**: Works in all modern browsers
- **Mobile Support**: Touch-friendly interface
- **Performance**: Smooth on various devices
- **Fallbacks**: Graceful degradation when needed

## Future Enhancements

### Planned Features

- **Custom Ratios**: User-defined aspect ratios
- **Preset Management**: Save and load custom presets
- **Batch Cropping**: Apply to multiple images
- **Export Options**: Various output formats
- **Undo/Redo**: Action history management

### Integration Ideas

- **AI Suggestions**: Smart crop recommendations
- **Face Detection**: Automatic face-centered cropping
- **Content Analysis**: Optimal crop based on image content
- **Cloud Sync**: Sync presets across devices

## Troubleshooting

### Common Issues

- **Aspect Ratio Not Locking**: Ensure preset is selected, not "Free"
- **Dimensions Not Updating**: Check if image is fully loaded
- **Crop Area Too Small**: Minimum 20px size enforced
- **Image Quality**: Cropping is simulated, original preserved

### Best Practices

- **Grid Usage**: Enable for better composition
- **Precise Positioning**: Use keyboard arrows for fine adjustments
- **Aspect Ratio Selection**: Choose appropriate ratio for intended use
- **Preview Check**: Always preview before applying

## Support and Documentation

### Getting Help

- **Keyboard Shortcuts**: Press `Ctrl+?` for help
- **Tooltips**: Hover over elements for descriptions
- **Status Messages**: Real-time feedback in the interface
- **Documentation**: Comprehensive guides and examples

The Crop Simulator represents a professional-grade cropping tool that brings advanced image editing capabilities directly into the media viewer, providing users with precise control over their image composition while maintaining an intuitive and accessible interface.
