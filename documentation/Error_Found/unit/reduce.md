# Errors / findings — `reduce`

| Field | Value |
|-------|--------|
| Module | `src/reduce.js` |
| Tests | `tests/unit/reduce.test.js` |
| Environment | Node v24.19.0, macOS (Darwin), commit `17bce67` |
| Status | JSDoc examples pass; findings are misuse / edge risks for cart totals |

---

## ERR-REDUCE-01 — Explicit `undefined` accumulator seeds with `undefined` → `NaN` sums

| Field | Detail |
|-------|--------|
| Function | `reduce(collection, iteratee, accumulator)` |
| Severity | **S2** if callers pass `undefined` thinking it means “no accumulator” |
| Priority | **P3** |
| Type | Spec/API subtlety: `arguments.length < 3` decides “no accumulator”. Passing `undefined` still counts as provided. |

### Steps / inputs

`reduce([1, 2], (sum, n) => sum + n, undefined)`

### Expected (if caller meant “omit accumulator”)

`3` (first element used as seed).

### Actual

`NaN` (`undefined + 1` → `NaN`).

### Scenario impact

**Scenario B**: `reduce(lines, sumPrices, maybeInitial)` where `maybeInitial` is unset/`undefined` can wipe the cart total to `NaN`.

### Reproducing test

- `tests/unit/reduce.test.js` → `explicit undefined accumulator is used as seed => NaN for sums`

---

## ERR-REDUCE-02 — Empty / null collection without accumulator returns `undefined`

| Field | Detail |
|-------|--------|
| Function | `reduce(collection, iteratee)` |
| Severity | **S3** — empty cart edge |
| Priority | **P3** |
| Type | Lodash-compatible; FE must supply `0` (or similar) as accumulator for money |

### Steps / inputs

1. `reduce([], (sum, n) => sum + n)`
2. `reduce(null, (sum, n) => sum + n)`

### Expected (safe cart total)

Prefer `0` when used for money without an explicit seed — or FE must always pass `0`.

### Actual

`undefined` for both.

### Scenario impact

**Scenario B**: empty cart without `reduce(..., 0)` can render `undefined` instead of `0.00`.

### Reproducing tests

- `tests/unit/reduce.test.js` → `empty array without accumulator returns undefined`
- `tests/unit/reduce.test.js` → `null without accumulator returns undefined`
