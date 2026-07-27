# Hot-Reloading Analysis

Why HoTMiXer does not ship hot-reloading out of the box, what it would take per backend, and why there's no one-size-fits-all solution.

---

## The Problem

"Hot reloading" means different things to different backends:
- For some it's free (language runtime already watches files).
- For some it's one dependency away.
- For some it requires architectural changes.
- For one it's fundamentally incompatible.

A unified CLI feature (`hotmixer dev --watch`) that works identically across all 12 backends is not possible without N separate implementations.

---

## Per-Backend Breakdown

### Already Works (language runtime handles it)

| Backend | Mechanism | Notes |
|---------|-----------|-------|
| **Django** | `runserver` auto-reloads | Watches Python files by default. Templates re-read each request. |
| **Flask** | `debug=True` auto-reloads | Already in the scaffold template. Watches Python, templates served fresh. |
| **Laravel** | Vite HMR + Artisan | Blade templates recompile on change. Vite handles frontend HMR. Built in. |
| **Clack/Ten** | REPL | Lisp's normal workflow is interactive redefinition. Live reload is the default. |
| **Clack/Djula** | REPL | Same as above. |

### One Dependency Away

| Backend | What's Needed | Effort |
|---------|---------------|--------|
| **Express** | Add `nodemon` as devDependency, mention `node --watch` for Node 18+ | 5 min |
| **Koa** | Same as Express | 5 min |
| **Mongoose** | HTML served from disk (instant changes). C code needs `entr` or a Makefile watch target. | 15 min |

### Needs a File Watcher

| Backend | What's Needed | Effort |
|---------|---------------|--------|
| **Gin** | Go's `html/template` parses at startup and caches. Need a wrapper that re-parses on change with `fsnotify`. Code changes need `go tool watch`. | 1-2 hrs |
| **Echo** | Same problem as Gin — templates compiled at startup. Same solution. | 1-2 hrs |
| **Actix Web** | Handlebars parsed at startup. Need file watcher for templates + `cargo watch` for Rust code. | 1-2 hrs |

### Fundamentally Incompatible

| Backend | Why | Options |
|---------|-----|---------|
| **Axum (Askama)** | Askama is a **compile-time** template engine. Templates are compiled into Rust code at `cargo build` time. You cannot reload an Askama template without recompiling. | (1) Switch to a runtime engine like Tera (significant refactor). (2) Document as a limitation. (3) Add a dynamic template fallback in dev mode. |

---

## Why This Isn't a Quick Feature

1. **12 distinct solutions.** Each backend needs bespoke watcher configuration, process management, and signal handling.
2. **Cross-platform process management.** Killing and restarting dev servers reliably on Linux, macOS, and Windows is non-trivial.
3. **Leaky abstraction.** A `hotmixer dev` command that works differently (or not at all) per backend is worse than documenting the per-backend approach.
4. **Axum is the blocker.** Until Askama is replaced or augmented with a runtime fallback, one of 12 backends simply cannot hot-reload.

---

## Recommended Approach

Rather than shipping a unified `hotmixer dev --watch` command:

1. **Document the native approach per backend** in post-scaffold instructions (e.g. "use `cargo watch` for Rust", "use `nodemon` for Node").
2. **Add dev dependencies where cheap** — bundle `nodemon` in Express/Koa templates, add `cargo-watch` to Rust template notes.
3. **Accept Axum's limitation** and document it clearly.
4. **Let the community contribute.** Users of specific backends know their ecosystem's best dev workflow better than a general-purpose scaffolder.

---

*If you want hot-reloading for your backend and have a design proposal, open an issue.*
