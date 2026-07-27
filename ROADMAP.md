# Roadmap

## Completed (1.0.0)
- [x] `hotmixer --version`/`-V` output
- [x] `hotmixer list-backends` command
- [x] Interactive prompts: detect installed tooling and skip unavailable backends
- [x] `--skip-git` flag to opt out of `git init`
- [x] Template variables: let `hotmixer create` accept `--port`, `--name`, etc.
- [x] Input validation (reject reserved backend/project names before scaffolding)
- [x] Post-scaffold instructions: add Django `collectstatic` and `migrate` prompts
- [x] Add `engines` to Python templates (require Python >= 3.8)
- [x] Offline-friendly templates (vendor htmx locally as fallback)
- [x] Per-backend integration tests (scaffold → install → serve → verify)
- [x] Code coverage for CLI logic
- [x] Semver commitment: all 12 backends pass full test suite
- [x] Documented API (all commands, flags, exit codes)
- [x] Migration guide for users upgrading from older scaffolds
- [x] Security audit (npm audit clean, no known vulnerabilities in deps)
- [x] Published to npm

## Completed (0.4.0)
- [x] Laravel skeleton upgraded from v10 (EOL) to v12
- [x] CLI dependencies updated (commander v8 → v13, inquirer v8 → v12)
- [x] `engines` field added to root package.json
- [x] `lack` added as explicit dependency in Clack ASD generation
- [x] Clack/Ten `:ten-template` ASDF component removed, template compilation deferred to runtime
- [x] Koa lockfile added in 0.3.0
- [x] Django URL wiring fixed in 0.3.0
- [x] Test suite added in 0.3.0

## Completed (0.3.0)
- [x] All 12 backends scaffold, build, serve, and respond correctly
- [x] htmx updated to 2.0.10 across all templates
- [x] Broken Go modules fixed (go.sum, dependency classification)
- [x] Template bugs fixed (wrong links, typo'd paths, static asset references)
- [x] CLI bugs fixed (createMainLisp in default case, Koa missing from frameworkFolderMap)
- [x] CHANGELOG.md created
- [x] README rewritten with real install instructions and known issues

## Future
- Hot-reloading design and implementation (watch files, restart dev server)
- Dynamic Laravel scaffolding (generate skeleton at install time like Django)
- Reduce npm package size (remove vendored mongoose.c, consider post-install scripts)
