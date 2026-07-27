# Manual Test Checklist — HoTMiXer 1.0.0

Run these tests before publishing to npm. Check off each item as it passes.

---

## 1. Installation & Basic Sanity

### 1.1 Global Install
```bash
npm install -g .
```
- [x] Installs without errors
- [x] `which hotmixer` resolves

### 1.2 Version Output
```bash
hotmixer --version
hotmixer -V
```
- [x] Both output `1.0.0`

### 1.3 Help Text
```bash
hotmixer --help
hotmixer create --help
```
- [x] Shows usage, commands, and options
- [x] `--skip-git` flag is documented
- [x] `--port` / `-p` flag is documented
- [x] `--backend` / `-b` flag is documented

---

## 2. list-backends Command

### 2.1 Basic Output
```bash
hotmixer list-backends
```
- [x] All 12 backends listed under correct language headings
- [x] Installed tooling shows green ✓
- [x] Missing tooling shows yellow ✗ (dimmed)

### 2.2 Verify Tooling Detection Accuracy
- [x] If PHP is not installed, Laravel shows ✗
- [x] If Rust is not installed, Actix Web and Axum show ✗
- [x] If SBCL is not installed, Clack/Ten and Clack/Djula show ✗
- [x] Node backends always show ✓
- [x] Python backends show ✓ if `python3` or `python` is in PATH
- [x] Go backends show ✓ if `go` is in PATH
- [x] C/Mongoose shows ✓ if `gcc` or `clang` is in PATH

### 2.3 list-backends on Bare System (optional)
- [x] Run on a system missing python/go/rust/php/sbcl — only Node backends should show ✓

---

## 3. Input Validation

### 3.1 Reserved Names
```bash
hotmixer create test --backend Flask
hotmixer create node_modules --backend Express
hotmixer create src --backend Gin
hotmixer create bin --backend Echo
hotmixer create .git --backend Koa
```
- [x] Each rejects with appropriate error message
- [x] Exit code is non-zero

### 3.2 Invalid Characters
```bash
hotmixer create "my project" --backend Flask
hotmixer create "proj/name" --backend Express
hotmixer create "my@pp" --backend Gin
```
- [x] Each rejects with "invalid characters" message

### 3.3 Must Start with Letter
```bash
hotmixer create "9project" --backend Express
hotmixer create "-project" --backend Flask
hotmixer create "_project" --backend Flask
```
- [x] Number prefix rejected
- [x] Hyphen prefix rejected  
- [x] Underscore prefix — decide if allowed; if not, reject

### 3.4 Unknown Backend
```bash
hotmixer create foo --backend NotARealBackend
```
- [x] Rejects with "Unknown backend" message
- [x] Suggests `list-backends`

### 3.5 No Tooling Available
If you can remove all tooling from PATH except Node:
```bash
hotmixer create myproject
```
- [x] Interactive prompt shows "No supported backend tooling detected"
- [x] Exits gracefully

---

## 4. Interactive Prompt (Tooling Detection)

### 4.1 Missing Languages Hidden
On a system missing PHP:
```bash
hotmixer create test-interactive
```
- [ ] PHP does not appear as a language choice
- [ ] Note printed about hidden languages

### 4.2 Framework Filtering
- [ ] If Python has only one framework available (e.g., Flask but not Django because django-admin is missing), the second prompt is skipped
- [ ] If a language has both frameworks available, the second prompt appears

### 4.3 All Languages Available
- [ ] On a fully-equipped system, all 7 languages appear as choices
- [ ] Selecting each language shows its available frameworks

---

## 5. --skip-git Flag

### 5.1 Skip Git Init
```bash
hotmixer create no-git-project --backend Express --skip-git
```
- [ ] Project scaffolds successfully
- [ ] No `.git` directory exists in the project
- [ ] No "Initializing Git repository" message in output

### 5.2 Default (With Git)
```bash
rm -rf with-git-project
hotmixer create with-git-project --backend Express
```
- [ ] `.git` directory exists in the project
- [ ] "Initializing Git repository" message appears

### 5.3 --skip-git with Interactive Prompt
```bash
hotmixer create skip-git-prompt --skip-git
```
- [ ] Interactive prompt still works normally
- [ ] Final project has no `.git` directory

---

## 6. --port / -p Flag

### 6.1 Port in Instructions
```bash
hotmixer create port-test --backend Express --port 5000
```
- [ ] Post-scaffold instructions appear (port is passed but Express doesn't use it in instructions currently)
- [ ] Project scaffolds without errors

### 6.2 Short Form
```bash
hotmixer create port-test-short --backend Laravel -p 9000
```
- [ ] Laravel instructions show `--port=9000`

### 6.3 Port Without --backend (Interactive)
```bash
hotmixer create port-interactive -p 3001
```
- [ ] Interactive prompt works normally
- [ ] Creates project without errors

---

## 7. Scaffold All 12 Backends

For each backend, scaffold a project and verify:

### 7.1 Flask
```bash
rm -rf flask-test
hotmixer create flask-test --backend Flask
```
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists (~51KB)
- [ ] `static/style.css` exists
- [ ] `static/hotmix_logo.png` exists
- [ ] `requirements.txt` exists
- [ ] `app.py` exists
- [ ] template references `{{ url_for('static', filename='htmx.min.js') }}` (NOT unpkg CDN)
- [ ] `.python-version` exists with content `3.8`

### 7.2 Django
```bash
rm -rf django-test
hotmixer create django-test --backend Django
```
- [ ] Project scaffolds successfully
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists
- [ ] template references `{% static 'htmx.min.js' %}` (NOT unpkg CDN)
- [ ] `.python-version` exists with content `3.8`
- [ ] Post-scaffold instructions include `migrate` and `collectstatic` steps

### 7.3 Gin
```bash
rm -rf gin-test
hotmixer create gin-test --backend Gin
```
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists
- [ ] `static/style.css` exists
- [ ] template references `/static/htmx.min.js` (NOT unpkg CDN)

### 7.4 Echo
```bash
rm -rf echo-test
hotmixer create echo-test --backend Echo
```
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists
- [ ] template references `/static/htmx.min.js` (NOT unpkg CDN)

### 7.5 Express
```bash
rm -rf express-test
hotmixer create express-test --backend Express
```
- [ ] `views/index.ejs` exists
- [ ] `public/htmx.min.js` exists
- [ ] template references `/htmx.min.js` (NOT unpkg CDN)

### 7.6 Koa
```bash
rm -rf koa-test
hotmixer create koa-test --backend Koa
```
- [ ] `views/index.ejs` exists
- [ ] `public/htmx.min.js` exists
- [ ] template references `/htmx.min.js` (NOT unpkg CDN)

### 7.7 Laravel
```bash
rm -rf laravel-test
hotmixer create laravel-test --backend Laravel
```
- [ ] `resources/views/index.blade.php` exists
- [ ] `public/htmx.min.js` exists
- [ ] template references `{{ asset('htmx.min.js') }}` (NOT unpkg CDN)

### 7.8 Actix Web
```bash
rm -rf actix-test
hotmixer create actix-test --backend "Actix Web"
```
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists
- [ ] template references `/static/htmx.min.js` (NOT unpkg CDN)

### 7.9 Axum
```bash
rm -rf axum-test
hotmixer create axum-test --backend Axum
```
- [ ] `templates/index.html` exists
- [ ] `static/htmx.min.js` exists
- [ ] `templates/base.html` references `/static/htmx.min.js` (NOT unpkg CDN)

### 7.10 Mongoose
```bash
rm -rf mongoose-test
hotmixer create mongoose-test --backend Mongoose
```
- [ ] `web_root/index.html` exists
- [ ] `web_root/htmx.min.js` exists
- [ ] template references `./htmx.min.js` (NOT unpkg CDN)

### 7.11 Clack/Ten
```bash
rm -rf clack-ten-test
hotmixer create clack-ten-test --backend "Clack/Ten"
```
- [ ] `src/templates.html` exists
- [ ] `public/htmx.min.js` exists
- [ ] template references `/public/htmx.min.js` (NOT unpkg CDN)

### 7.12 Clack/Djula
```bash
rm -rf clack-djula-test
hotmixer create clack-djula-test --backend "Clack/Djula"
```
- [ ] `templates/index.djhtml` exists
- [ ] `public/htmx.min.js` exists
- [ ] template references `/public/htmx.min.js` (NOT unpkg CDN)

---

## 8. No CDN References (Critical)

Run against the full source tree:
```bash
grep -r "unpkg.com" CLI/setup_script.js flask/ gin/ echo/ node/ koa/ laravel/ rust/ rust_axum/ mongoose/ clack-ten/ clack-djula/ django/
```
- [ ] Zero matches (only legitimate matches would be docs/comments, if any)

---

## 9. Full Test Suite

```bash
npm test
```
- [ ] All 12 backends: PASS
- [ ] Zero failures
- [ ] Skipped backends understood and expected (e.g., Laravel if Docker unavailable, Lisp if SBCL unavailable)
- [ ] Test suite banner shows v1.0.0

---

## 10. Coverage

```bash
npm run coverage
```
- [ ] Runs without errors
- [ ] Reports coverage percentage

---

## 11. Security

```bash
npm audit
```
- [ ] 0 vulnerabilities (high/critical)

---

## 12. npm Pack

```bash
npm pack --dry-run
```
- [ ] No unexpected files included (check for stray test dirs, coverage output, etc.)
- [ ] `htmx.min.js` files (12 copies, ~50KB each) are included in their respective backend directories
- [ ] `.github/` is NOT included (check if npmignore needed)

---

## 13. Edge Cases

### 13.1 Create in Existing Directory
```bash
mkdir existing-dir
hotmixer create existing-dir --backend Express --skip-git
```
- [ ] Warns directory already exists
- [ ] Does NOT overwrite cleanly — verify behavior

### 13.2 Spaces in Backend Name
```bash
hotmixer create space-test --backend "Actix Web"
hotmixer create space-test2 --backend "Clack/Ten"
```
- [ ] Both scaffold successfully

### 13.3 Very Long Project Name
```bash
hotmixer create this-is-a-very-long-project-name-that-should-still-work --backend Express --skip-git
```
- [ ] Scaffolds successfully

### 13.4 Uppercase Project Name
```bash
hotmixer create MyCoolProject --backend Express --skip-git
```
- [ ] Scaffolds successfully

### 13.5 Django Reserved Name
```bash
hotmixer create test --backend Django
```
- [ ] Rejected at input validation (before Django tries to create it)
  *Note: Django also has its own "test" check — verify the error comes from HoTMiXer's validation*

---

## 14. Post-Scaffold Instructions Accuracy

For each backend, verify the printed instructions match what's needed:

| Backend | Key Verification |
|---------|-----------------|
| Flask | Mentions `venv`, `pip install -r requirements.txt`, `flask run` |
| Django | Mentions `migrate`, `collectstatic`, `runserver` — in that order |
| Gin | Mentions `go run main.go` |
| Echo | Mentions `go run main.go` |
| Express | Mentions `npm install`, `node app.js` |
| Koa | Mentions `npm install`, `node app.js`, links to koajs.com (not expressjs.com) |
| Laravel | Mentions `composer install`, `php artisan key:generate`, `php artisan serve` |
| Actix Web | Mentions `cargo run` |
| Axum | Mentions `cargo run` |
| Mongoose | Mentions `gcc main.c mongoose.c -o server` |
| Clack/Ten | Mentions REPL, `(start)`, links to lack/ten/ningle |
| Clack/Djula | Mentions REPL, `(start)`, links to lack/djula/ningle |

---

## 15. Cleanup

After testing:
```bash
rm -rf no-git-project with-git-project skip-git-prompt port-test port-test-short port-interactive
rm -rf flask-test django-test gin-test echo-test express-test koa-test laravel-test
rm -rf actix-test axum-test mongoose-test clack-ten-test clack-djula-test
rm -rf existing-dir test-interactive myproject
rm -rf this-is-a-very-long-project-name-that-should-still-work MyCoolProject
rm -rf /tmp/hotmixer-*
```

---

*Last updated: 2026-07-27 for HoTMiXer 0.9.9*
