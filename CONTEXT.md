# Algorithm Visualizer

An interactive pathfinding visualizer where users place terrain, walls, and markers on a grid and watch algorithms search for the shortest path.

## Language

**Default**:
The baseline walkable cell type (cost = 1). The grid starts entirely default except for start and goal markers.
_Avoid_: Empty, clear, normal

**Gravel**:
A walkable cell type with elevated traversal cost (cost = 2). Represents rough terrain that algorithms should prefer to route around when cheaper paths exist.
_Avoid_: Trap, terrain, weight, mud, swamp

**Wall**:
An impassable barrier cell. Algorithms cannot traverse walls.
_Avoid_: Block, obstacle, barrier

**Start**:
The unique origin cell where pathfinding begins. Cannot be placed on wall or gravel.
_Avoid_: Source, root, origin

**Goal**:
The unique target cell where pathfinding ends. Cannot be placed on wall or gravel.
_Avoid_: Target, destination, end, finish

**Cost**:
The traversal expense of stepping into a cell. Used by weighted algorithms (A\*, Dijkstra) to discriminate between paths. Default = 1, Gravel = 2. Unweighted algorithms (BFS, DFS) ignore cost.
_Avoid_: Weight, distance, penalty

**Edit mode**:
The active tool selected in the toolbar determining what happens when a user clicks or drags on the grid. All tools are one-way (no toggling).
_Avoid_: Brush, tool, paint mode
