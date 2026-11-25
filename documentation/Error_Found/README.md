# Error findings (Group 85)

Findings are grouped the same way as the test tree, so each suite style has a matching place for defects.

```
Error_Found/
├── unit/        ← from tests/unit (real-deps suites) — current findings
├── isolated/    ← from tests/isolated (mocked suites) — later
└── composed/    ← from tests/composed (multi-module flows) — later
```

Severity / priority follow Test Plan §7.3.

## unit/

| File | Module | Confirmed failing tests? | Summary |
|------|--------|--------------------------|---------|
| [unit/filter.md](./unit/filter.md) | `filter` | **Yes** (4) | Empty results return `[[]]` |
| [unit/ceil.md](./unit/ceil.md) | `ceil` | **Yes** (3) + money risk | Bad precision / Infinity → `NaN`; float ceil overcharge |
| [unit/toNumber.md](./unit/toNumber.md) | `toNumber` | No (risks) | Blank → `0`; comma decimals; null-proto throw |
| [unit/add.md](./unit/add.md) | `add` | No (risks) | String concat; `0.1+0.2` float |
| [unit/reduce.md](./unit/reduce.md) | `reduce` | No (risks) | Explicit `undefined` seed; empty → `undefined` |

## isolated/

Placeholder — add one markdown file per module when isolated/mocked suites find issues.

## composed/

Placeholder — add one markdown file per composed flow when multi-module suites find issues.

Environment baseline: Node v24.19.0, Darwin, commit `17bce67` (update SHA when re-verified).
