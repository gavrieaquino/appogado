# Vendored skill: ui-ux-pro-max

- Source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (`.claude/skills/ui-ux-pro-max`)
- Commit: 8db3633 (2026-11-25), MIT licence (see LICENSE)
- Removed: `scripts/tests/` (upstream test fixtures, not needed to run the skill)
- Reviewed before adding: the scripts read the bundled CSV/JSON files only; no network calls or subprocesses.

Run from any directory: `python3 -I .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`

Its advice is a recommendation. Where it conflicts with `CLAUDE.md`, the CPRA rules in
`docs/compliance-rules.md`, or a dated decision in `docs/decisions.md`, the project rules win.
