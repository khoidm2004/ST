# unit — per-file tests with real dependencies

Purpose: one suite per public module; call the real export and let real deps run (no mocks).

Suite naming: `describe('unit / <module> (real deps)', …)`.
