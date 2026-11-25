# Errors — `ceil`

| Field | Value |
|-------|--------|
| Module | `src/ceil.js` (uses `src/.internal/createRound.js`) |
| Tests | `tests/unit/ceil.test.js` |
| Environment | Node v24.19.0, macOS (Darwin), commit `17bce67` |
| Status | Confirmed by failing unit tests; reported at the public `ceil` API (§5.2) |

---

## ERR-CEIL-01 — Non-integer precision yields `NaN`

| Field | Detail |
|-------|--------|
| Function | `ceil(number, precision)` |
| Severity | **S3** Minor / edge — unexpected `NaN` for fractional precision |
| Priority | **P3** |
| Root cause (observed) | `.internal/createRound` adds `precision` into an exponential string without truncating it to an integer. A value like `1.5` produces an invalid exponent path and `Math.ceil` returns `NaN`. |

### Steps / inputs

`ceil(4.006, 1.5)`

### Expected

`4.1` (precision truncated to `1`, then round up — Lodash-compatible behavior).

### Actual

`NaN`

### Scenario impact

Unlikely in FE if precision is hard-coded to `2`, but any caller passing a computed/non-integer precision gets a broken price.

### Reproducing test

- `tests/unit/ceil.test.js` → `non-integer precision is truncated to an integer`

---

## ERR-CEIL-02 — `Infinity` / `-Infinity` with precision yield `NaN`

| Field | Detail |
|-------|--------|
| Function | `ceil(number, precision)` |
| Severity | **S3** Minor — edge numeric handling |
| Priority | **P3** |
| Root cause (observed) | With non-zero precision, `createRound` builds `` `${number}e` ``. For `Infinity` this does not preserve infinity through the shift/unshift path, so the result becomes `NaN`. |

### Steps / inputs

1. `ceil(Infinity, 2)`
2. `ceil(-Infinity, 2)`

### Expected

1. `Infinity`
2. `-Infinity`

### Actual

`NaN` for both.

### Scenario impact

Rare for product prices; still breaks §8.4 “cover NaN / Infinity” expectations and any defensive total that uses `Infinity` as a sentinel.

### Reproducing tests

- `tests/unit/ceil.test.js` → `Infinity with precision stays Infinity`
- `tests/unit/ceil.test.js` → `-Infinity with precision stays -Infinity`

---

## ERR-CEIL-03 — Float noise rounded up overcharges by one cent (behavior risk)

| Field | Detail |
|-------|--------|
| Function | `ceil(number, precision)` (often after `add`) |
| Severity | **S1** Critical if used for money display/charge — wrong total |
| Priority | **P2** |
| Type | Behavioral / IEEE-754 interaction (not a JSDoc mismatch; document as money risk) |

### Steps / inputs

`ceil(0.30000000000000004, 2)`  
(equivalent to `ceil(add(0.1, 0.2), 2)` when those amounts are summed first)

### Expected (business / Scenario B)

Prefer `0.30` for two-decimal money, or a banker’s / half-up monetary round — not a silent +0.01 from binary float residue.

### Actual

`0.31`

### Scenario impact

**Scenario B** (cart total): rounding *up* float noise can overcharge by €0.01 (or equivalent).

### Reproducing test

- `tests/unit/ceil.test.js` → `float noise is rounded up: ceil(0.30000000000000004, 2) => 0.31`
