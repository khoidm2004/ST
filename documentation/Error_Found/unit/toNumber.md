# Errors / findings — `toNumber`

| Field | Value |
|-------|--------|
| Module | `src/toNumber.js` (uses public `isObject`, `isSymbol`) |
| Tests | `tests/unit/toNumber.test.js` |
| Environment | Node v24.19.0, macOS (Darwin), commit `17bce67` |
| Status | No failing JSDoc-example cases; findings below are behavioral risks for the store |

---

## ERR-TONUMBER-01 — Blank string becomes `0` (mandatory price risk)

| Field | Detail |
|-------|--------|
| Function | `toNumber(value)` |
| Severity | **S2** if used alone to validate mandatory price — silent accept of empty input |
| Priority | **P2** |
| Type | Documented Lodash-like behavior; unsafe if FE treats “parsed number” as “field valid” |

### Steps / inputs

1. `toNumber('')`
2. `toNumber('   ')`

### Expected (library)

`0` (current Lodash-compatible behavior).

### Expected (Scenario C product form)

Blank mandatory price should fail validation — not become a free €0 product.

### Actual

`0` for both.

### Scenario impact

**Scenario C** (producer add product): empty price string can pass a naive `toNumber` check.

### Reproducing tests

- `tests/unit/toNumber.test.js` → `blank string %p => %p`

---

## ERR-TONUMBER-02 — Comma decimal is not parsed (`'1,50'` → `NaN`)

| Field | Detail |
|-------|--------|
| Function | `toNumber(value)` |
| Severity | **S2** for locales that use comma decimals |
| Priority | **P3** |
| Type | Locale / input-format gap vs European price entry |

### Steps / inputs

`toNumber('1,50')`

### Expected (if locale prices allowed)

`1.5`

### Actual

`NaN`

### Scenario impact

**Scenario B / C**: typed European-style prices become invalid numbers; filters/totals break unless FE normalizes first.

### Reproducing test

- `tests/unit/toNumber.test.js` → `toNumber("1,50") => NaN`

---

## ERR-TONUMBER-03 — `Object.create(null)` throws `TypeError`

| Field | Detail |
|-------|--------|
| Function | `toNumber(value)` |
| Severity | **S3** Minor — uncommon input |
| Priority | **P4** |
| Type | Throws instead of returning `NaN`; same class of issue as upstream Lodash for null-prototype objects |

### Steps / inputs

`toNumber(Object.create(null))`

### Expected (lenient API)

Prefer `NaN` without throwing.

### Actual

Throws `TypeError` (`.replace` path / string coercion on object without `toString`/`valueOf` from `Object.prototype`).

### Scenario impact

Low unless FE builds dictionary objects without a prototype and feeds them into `toNumber`.

### Reproducing test

- `tests/unit/toNumber.test.js` → `null-prototype object throws TypeError`
