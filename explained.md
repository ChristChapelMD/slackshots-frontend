# SlackShots - Image Grid System Overview

## Overview of Components & Data Flow

SlackShots uses a modular architecture to handle image loading, display, and interaction. This document explains how data flows through the system and how the grid view works.

## Core Components

### 1. Store Management (Zustand)

The application uses Zustand for state management, with the following key stores:

- **FileStore**: Manages file data, loading state, pagination, and prioritized file IDs
- **UIStore**: Manages UI preferences like view mode, grid density, etc.
- **SelectionStore**: Manages file selection state
- **DrawerStore**: Manages drawer/modal state for file actions

### 2. Main Content Structure

```
MainContentContainer
└── GridView
    └── GridItem
        └── FileRenderer
            └── (Specific file type renderer - e.g., ImageRenderer)
                └── (Specific display component - e.g., ImageGridDisplay)
```

## Data Loading & Rendering Flow

1. **Initial Data Loading**: 
   - When `MainContentContainer` mounts, it checks if files exist
   - If no files and not currently loading, it triggers `loadFiles(false)`
   - The `loadFiles` function in `file-store.ts` makes API calls to fetch files

2. **Infinite Scroll**:
   - `MainContentContainer` uses the `useInfiniteScroll` hook
   - A sentinel element is placed at the bottom of the content
   - When the sentinel becomes visible, `loadFiles(true)` is called to load more files
   - The `useInfiniteScroll` hook uses IntersectionObserver to detect visibility

3. **Priority Loading**: 
   - `usePriorityTrack` hook tracks which items are visible in the viewport
   - Visible file IDs are stored in `prioritizedFileIds` in the FileStore
   - These prioritized files get `priority={true}` for Next.js Image optimization
   - This ensures visible images load first, optimizing performance

## Rendering Optimizations

1. **Memoization**: Components use `React.memo` to prevent unnecessary re-renders
2. **Lazy Loading**: Images use Next.js Image component with lazy loading
3. **Prioritization**: Visible images are prioritized for loading
4. **Throttled Updates**: Priority tracking uses throttling to minimize DOM updates
5. **Efficient Observer Usage**: IntersectionObserver is used for both infinite scrolling and priority tracking

## Grid Density System

The application supports three grid density levels:

- **Low (`lo`)**: Fewer, larger items per row
- **Medium (`md`)**: Default density
- **High (`hi`)**: More, smaller items per row

The grid density is stored in:
- Local storage for persistence
- UIStore for application state

The `useGridDensity` hook provides a convenient interface to access and update the grid density setting.

## Critical File Relationships

1. **`grid-view.tsx`**: Main grid container that renders `GridItem` components
2. **`grid-item.tsx`**: Wrapper for each file, manages selection, hover state
3. **`file-renderer.tsx`**: Determines which renderer to use based on file type
4. **`image-renderer.tsx`**: Picks the correct display component based on view mode
5. **`image-grid.tsx`**: Renders the actual image in grid view using Next.js Image
6. **`main-content-container.tsx`**: Container for the grid, manages scrolling
7. **`file-store.ts`**: Manages file data and loading operations
8. **`ui-store.ts`**: Manages UI state including view mode and grid density

## Performance Considerations

1. **Windowing**: The system does NOT use virtualized lists/windows, instead:
   - It relies on browser lazy loading
   - Uses efficient priority loading
   - Leverages Next.js Image component for optimization
   - Uses memoization to prevent unnecessary re-renders

2. **IntersectionObserver Usage**:
   - For infinite scrolling at page bottom
   - For priority tracking of visible items
   - Both use appropriate thresholds and rootMargins to ensure smooth UX

3. **Image Loading Strategy**:
   - Prioritizes visible images
   - Uses placeholders for loading state
   - Handles errors gracefully
   - Optimizes image sizes with Next.js Image

## Fix Implementation

The grid wasn't working due to several issues:

1. **Initial Loading**: Files weren't being loaded on initial render
2. **IntersectionObserver Configuration**: The infinite scroll observer was using an incorrect root
3. **Memory Issues in Priority Tracking**: The priority tracking had inefficiencies
4. **Component Re-renders**: Excessive re-renders were happening due to missing memoization

The fix addressed these issues by:

1. Adding initial file loading in `MainContentContainer`
2. Fixing the IntersectionObserver configuration 
3. Optimizing the priority tracking with throttling and better state management
4. Adding memoization to prevent unnecessary re-renders
5. Improving image loading with better placeholder handling

These changes maintain the original architecture while improving performance and reliability.