# Changelog

## 1.0.0 (2026-07-27) — Stable Release

### CLI Experience
- Added `--version` / `-V` flag
- Added `hotmixer list-backends` command with tooling availability indicators
- Added `--skip-git` flag to opt out of `git init`
- Added tooling detection: interactive prompts now skip backends whose toolchain is not installed
- Added input validation: rejects reserved names, invalid characters, and Python module conflicts
- Added `--port` / `-p` option (passed through to post-scaffold instructions)
- Improved colored, structured CLI output throughout

### Quality & Validation
- Input validation rejects reserved names (`test`, `node_modules`, etc.) before scaffolding
- Django post-scaffold instructions now correctly list `migrate` and `collectstatic` steps
- Python templates include `.python-version` (requires Python >= 3.8)

### Offline Support
- Vendored htmx v2.0.10 locally in all 12 backend templates
- All templates now reference local `htmx.min.js` instead of unpkg CDN

### Testing

### Release Readiness
- Security audit: `npm audit` reports 0 vulnerabilities
- Semver commitment: all 12 backends pass full test suite
- Version bumped to 1.0.0

### Deferred
- Hot-reloading (watch files, restart dev server)
- Dynamic Laravel scaffolding (generate skeleton at install time)
- npm package size reduction (vendored mongoose.c optimization)

## 0.4.0 (2026-07-26) — Backend Modernization

### Laravel
- Upgraded skeleton from Laravel 10 (EOL) to **Laravel 12**
- Changed session driver from `database` to `file` to avoid SQLite dependency
- Added automatic `database.sqlite` creation during scaffolding
- Updated composer.lock for PHP 8.5 compatibility
- Updated Blade template instruction text for v12 paths

### CLI Dependencies
- `commander` updated from v8 → v13 (changed to named export: `import { program }`)
- `inquirer` updated from v8 → v12 (API-compatible, ESM-native, 0 vulnerabilities)
- Added `engines` field: `"node": ">=16"`

### Clack/Lisp
- `lack` added as explicit dependency in generated ASD for both Clack/Ten and Clack/Djula
- Removed `:ten-template` ASDF component to eliminate preload requirement
- Clack/Ten template function resolved at runtime via `find-symbol` to avoid compile-file errors
- Both Lisp backends now load cleanly via ASDF

### Housekeeping
- Removed README "Known Issues" section (Laravel EOL resolved)
- ROADMAP.md updated to mark 0.4.0 items complete

## 0.3.0 (2026-07-26) — Wake-Up Release

First release after ~2 years. Focused on fixing everything that broke during the hiatus.

### HTMX
- Updated all 12 backend templates from htmx 1.9.10 to **htmx 2.0.10** (latest stable)
- Fixed `hx-swap="outerHTML"` → `hx-swap="innerHTML"` everywhere — the demo button now works more than once

### Go Backends (Gin, Echo)
- Ran `go mod tidy` to generate missing `go.sum` files
- Fixed all dependencies incorrectly marked `// indirect`
- Echo template: fixed copy-pasted Gin docs link

### Django
- Fixed scaffolding bug where project-level `urls.py` was overwritten instead of extended
- App routes are now injected into the Django-generated URL config

### Template Fixes (All Backends)
- Flask: static assets now use `url_for('static', ...)` instead of fragile `../static/` relative paths
- Actix Web, Axum: static paths changed from `../static/` to `/static/`
- Clack/Ten, Clack/Djula: CSS/logo paths corrected to `/public/` prefix to match Lack static middleware
- Clack/Ten, Clack/Djula: fixed copy-pasted "templates.ten" instruction text
- Mongoose: fixed template directory reference in instruction text
- Express, Koa: fixed page title "HoTMiX!" → "HoTMiXer!"
- Consistent "HotMiXer Logo" alt text across all templates

### Node.js Backends
- Express `package.json`: fixed broken `"main"` field and `"run"` script → `"start": "node app.js"`
- Koa `package.json`: added `"start"` script, generated `package-lock.json`

### Laravel
- Created missing `resources/css/app.css` to unblock Vite builds

### CLI
- `createMainLisp` removed from default switch case — it was incorrectly called for Flask, Gin, Express, etc., creating a bogus `src/` directory and printing "Unknown backend for Lisp"
- `createMainLisp` now ensures `src/` directory exists before writing (fixes Clack/Djula scaffold)
- Koa backend added to `frameworkFolderMap` in `copyTemplateFiles` — was missing entirely, so Koa projects got the Echo template instead
- Django scaffolding: project-level `urls.py` now extended instead of overwritten

### Housekeeping
- Expanded `.gitignore` to cover build artifacts across Go, Rust, PHP, and Node backends
- Rewrote README with real install instructions, full backend list, and per-backend quickstart
- Added CHANGELOG.md
- Added ROADMAP.md with plan to 1.0.0

### Test Suite
- Added `test/run.sh` — full smoke test covering all 12 backends
- Wired into `npm test` (replaces previous no-op)
- Tests scaffold → install → serve → verify for each backend
- Detects missing tooling and skips gracefully
- Lisp backends verified via ASDF load (server start requires interactive REPL)
- Laravel tested via Docker (PHP + Composer containers)
