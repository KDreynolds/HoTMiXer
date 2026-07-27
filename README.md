# HoTMiXer

HoTMiXer is a CLI tool that scaffolds new web projects with [HTMX](https://htmx.org) plus your choice of backend. Pick a language, pick a framework, and start coding immediately.

## Installation

```bash
npm install -g hotmixer
```

Requires Node.js 16+.

## Usage

```bash
hotmixer create myproject
```

You'll be prompted to choose a language and framework. Or skip the prompts:

```bash
hotmixer create myproject --backend Flask
```

### Commands

| Command | Description |
|---------|-------------|
| `hotmixer create <name>` | Scaffold a new project |
| `hotmixer list-backends` | List available backends with tooling status |
| `hotmixer --version` / `-V` | Print version |

### Create Options

| Option | Description |
|--------|-------------|
| `-b, --backend <name>` | Skip interactive prompts, use named backend |
| `-p, --port <port>` | Dev server port (shown in instructions) |
| `--skip-git` | Skip `git init` |
| `--help` | Show help |

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (invalid name, unknown backend, no tooling detected) |

## Supported Backends

### Python
- **Flask** — Jinja2 templates, Pip requirements
- **Django** — Django template tags, `django-admin` bootstrap

### Go
- **Gin** — Go templates, `go.mod` ready
- **Echo** — Static file serving, middleware included

### Node.js
- **Express** — EJS templates, npm scripts
- **Koa** — EJS templates, koa-router

### PHP
- **Laravel** — Blade templates, Composer, full skeleton

### Rust
- **Actix Web** — Handlebars templates, Cargo ready
- **Axum** — Askama templates, Tokio runtime

### C/C++
- **Mongoose** — Single-header embedded web server, C source

### Common Lisp
- **Clack/Ten** — Ten templates, Ningle router, Clack server
- **Clack/Djula** — Djula templates, Ningle router, Clack server

## Getting Started Per Backend

### Python (Flask)
```bash
cd myproject
python -m venv venv
source venv/bin/activate      # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### Python (Django)
```bash
cd myproject
python -m venv venv
source venv/bin/activate
pip install django
python manage.py migrate
python manage.py collectstatic
python manage.py runserver
```

### Go (Gin / Echo)
```bash
cd myproject
go mod tidy
go run main.go
```

### Node.js (Express / Koa)
```bash
cd myproject
npm install
npm start
```

### PHP (Laravel)
```bash
cd myproject
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

### Rust (Actix Web / Axum)
```bash
cd myproject
cargo run
```

### C/C++ (Mongoose)
```bash
cd myproject
gcc main.c mongoose.c -o server
./server
```

### Common Lisp (Clack/Ten, Clack/Djula)
Start your REPL (SBCL, CCL, etc.), load the ASDF system, switch to
the project package, and call `(start)`.

## Migration from Pre-0.9.9 Scaffolds

If you scaffolded a project with an older version of HoTMiXer:

- **htmx CDN → local**: Templates now bundle `htmx.min.js` locally. If you update your scaffold, replace the unpkg `<script>` tag with the local path for your backend.
- **New CLI flags**: `--skip-git`, `--version`, `list-backends`, and `--port` are now available.
- **Input validation**: Project names are now validated before scaffolding. Reserved names like `test` and `node_modules` are rejected.
- **Django instructions**: `collectstatic` and `migrate` steps are now documented in post-scaffold instructions.

## Have a Feature Idea?

Open an issue or PR on [GitHub](https://github.com/KDreynolds/HoTMiXer) — new backends,
hot-reloading designs, and other improvements are welcome.

## Contributing

Open an issue or PR on [GitHub](https://github.com/KDreynolds/HoTMiXer).

## License

MIT. See [LICENSE](https://github.com/KDreynolds/HoTMiXer) for details.
