# Add Gravel cell type with derived costs

We added a new `'gravel'` cell type (cost = 2) and renamed the baseline `'empty'` type to `'default'`. Costs are derived from cell type via a lookup function rather than stored in a separate matrix, because gravel always has the same cost and we have no near-term need for per-cell cost variation.

We rejected an independent `costs: number[][]` matrix on GridModel because cost would always be a function of cell type — the two matrices would be entirely redundant. If per-cell cost variation is needed in the future, a cost matrix can be added then.

We converted all edit-mode tools to one-way (place only) instead of toggle-based, because toggle semantics break down with three+ terrain types. The `'empty'` tool was renamed to `'default'` for consistency.
