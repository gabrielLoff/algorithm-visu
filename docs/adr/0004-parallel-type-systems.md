# Parallel type systems for multi-visualizer architecture

We will use separate, parallel type hierarchies for each algorithm domain (pathfinding and sorting) rather than a single generic `AlgorithmFn`/`AlgorithmStep` abstraction. Pathfinding types will be renamed from the current bare `Algorithm*` names to the domain-specific `PathfindingAlgorithm*`, and sorting will follow with its own `SortingAlgorithm*` types.

We rejected a generic abstraction over input types because pathfinding and sorting operate on fundamentally different data structures (2D grid vs. 1D array) with different step payloads (frontier/visited/current/path vs. array/compared/swapped). Forcing them into one generic interface would obscure domain semantics and make algorithm code harder to teach. Parallel types keep each domain self-documenting at the cost of a small amount of duplicated hook code (useAnimation vs. useSortingAnimation).

Both domains share the same generator pattern — each algorithm is a generator function yielding steps — and the same registry pattern (typed array + lookup function). Algorithm files will live in domain subdirectories: `src/algorithms/pathfinding/` and `src/algorithms/sorting/`.

Components that don't depend on domain-specific types (ControlBar, speed slider) are shared. Components that do (Toolbar, InfoPanel, canvas) are domain-specific.
