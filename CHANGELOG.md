# Changelog

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
