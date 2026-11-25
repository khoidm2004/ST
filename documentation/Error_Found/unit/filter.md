# Errors — `filter`

| Field | Value |
|-------|--------|
| Module | `src/filter.js` |
| Tests | `tests/unit/filter.test.js` |
| Environment | Node v24.19.0, macOS (Darwin), commit `17bce67` |
| Status | Confirmed by failing unit tests (UT-F-04, UT-F-06, UT-F-07) |

---

## ERR-FILTER-01 — Empty result is `[[]]` instead of `[]`

| Field | Detail |
|-------|--------|
| Function | `filter(array, predicate)` |
| Severity | **S2** Major — incorrect search/empty results (Scenario A) |
| Priority | **P2** |
| Root cause (observed) | Result buffer is initialized as `[[]]` instead of `[]` (line ~28). When no element matches (or the collection is empty / nullish), that nested empty array is returned unchanged. |

### Steps / inputs

1. `filter([1, 2, 3], () => false)`
2. `filter([], () => true)`
3. `filter(null, () => true)`
4. `filter(undefined, () => true)`

### Expected (JSDoc + Test Plan §9.2)

`[]` for all of the above.

### Actual

`[[]]` for all of the above.

### Scenario impact

**Scenario A** (customer search / filter): a query with no matches would show one blank/empty “product” instead of an empty list. Same for empty catalogs.

### Reproducing tests

- `tests/unit/filter.test.js` → `no matches => [] (UT-F-04)`
- `tests/unit/filter.test.js` → `empty array => [] (UT-F-06)`
- `tests/unit/filter.test.js` → `null collection => [] (UT-F-07)`
- `tests/unit/filter.test.js` → `undefined collection => []`

### Notes

Matching cases (UT-F-01…03, UT-F-05) still pass because a successful first write overwrites `result[0]`. The defect is exposed only when the result stays empty.
