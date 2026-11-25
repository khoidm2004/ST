# Errors / findings — `add`

| Field | Value |
|-------|--------|
| Module | `src/add.js` (uses `src/.internal/createMathOperation.js`) |
| Tests | `tests/unit/add.test.js` |
| Environment | Node v24.19.0, macOS (Darwin), commit `17bce67` |
| Status | JSDoc example `add(6, 4) => 10` passes; findings are contract / money risks |

---

## ERR-ADD-01 — String operands are concatenated, not added

| Field | Detail |
|-------|--------|
| Function | `add(augend, addend)` |
| Severity | **S1** if price/qty arrive as strings from forms — corrupted totals |
| Priority | **P2** |
| Type | Deviates from JSDoc `@param {number}`; matches current implementation (string branch in math helper) |

### Steps / inputs

1. `add('6', '4')`
2. `add(6, '4')`
3. `add('2.50', 1)`

### Expected (JSDoc: two numbers)

1. `10`
2. `10`
3. `3.5`

### Actual

1. `'64'`
2. `'64'`
3. `'2.501'`

### Scenario impact

**Scenario B**: cart lines often come from inputs as strings. Concatenation produces nonsense totals / types.

### Reproducing tests

- `tests/unit/add.test.js` → `string operands are concatenated, not summed`

### Policy note (Test Plan §3.4)

Team should decide: treat as **defect vs JSDoc**, or document as known behavior and require FE to coerce with `toNumber` first.

---

## ERR-ADD-02 — IEEE-754 float residue (`0.1 + 0.2`)

| Field | Detail |
|-------|--------|
| Function | `add(augend, addend)` |
| Severity | **S2** when combined with `ceil(..., 2)` — see ERR-CEIL-03 |
| Priority | **P2** |
| Type | Language floating-point limitation; not a unique bug in `add`, but material for money |

### Steps / inputs

`add(0.1, 0.2)`

### Expected (decimal money)

`0.3`

### Actual

`0.30000000000000004`

### Scenario impact

**Scenario B**: feeds ERR-CEIL-03 (`ceil` → `0.31`).

### Reproducing test

- `tests/unit/add.test.js` → `add(0.1, 0.2) => 0.30000000000000004`
