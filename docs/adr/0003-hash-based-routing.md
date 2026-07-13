# Hash-based routing for multi-visualizer navigation

We will use `window.location.hash` (e.g. `#pathfinding`, `#sorting`) for navigating between visualizer pages instead of adding React Router or any other routing library. This keeps the dependency footprint at zero and is sufficient for the current scale — a handful of pages with no nested routes, no params, and no data loading.

We rejected React Router because it adds a dependency for a problem we don't have yet — the app is a single-developer educational tool, not a multi-route production SPA. We rejected state-based navigation (a `useState` flag in App) because it produces unlinkable pages and breaks browser back/forward.

A `VisualizerInfo` registry (similar to the existing `AlgorithmInfo` and `MazeInfo` patterns) will register each visualizer page with its hash path, title, description, and component. Adding a new visualizer means adding one entry to this array.

If routing needs grow beyond simple hash switching, migrating to React Router is a mechanical refactor: replace the hash-reading `useEffect` with `<Routes>`, no architecture changes required.
