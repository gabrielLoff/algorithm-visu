# Home page with multi-visualizer navigation

## Context

The app currently renders the pathfinding visualizer directly. To support additional visualizer types (sorting, tree traversal, graph traversal, search), we need a home page that lists available visualizers and a navigation mechanism to switch between them.

## Routing

Hash-based routing via `window.location.hash`. No router library.

- `#/` or no hash → home page
- `#/pathfinding` → pathfinding visualizer
- `#/sorting` → sorting visualizer (future)
- etc.

`App.tsx` becomes the router shell: it listens to `hashchange`, renders the matching page, or falls back to the home page.

## Visualizer registry

A `VisualizerInfo` type and `getVisualizers()` function, following the existing registry pattern (`AlgorithmInfo`/`getAlgorithms`, `MazeInfo`/`getMazes`):

```typescript
interface VisualizerInfo {
  name: string;
  description: string;
  hash: string;
  component: () => JSX.Element;
}
```

`src/visualizers/index.ts` exports the array. Adding a visualizer is one entry.

Initial entry: pathfinding.

## Pages

```
src/pages/
├── HomePage.tsx        # Renders VisualizerInfo cards
└── PathfindingPage.tsx # Current App.tsx contents, extracted
```

`App.tsx` switches on hash and renders the matching page's component.

## Home page design

- Each visualizer renders as a card with: title + short description
- Clicking a card navigates to that visualizer (sets `location.hash`)
- Home page is the default/fallback route

## Navigation within visualizer pages

- Each visualizer page includes a "Home" button that clears the hash (or sets it to `#/`)
- Browser back/forward works natively via `hashchange` events

## What's extracted from App.tsx

`PathfindingPage.tsx` is a direct extraction — all current state, hooks, and components move there unchanged. `App.tsx` becomes thin: hash listener + page switch.
