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

## Contributing

Open an issue or PR on [GitHub](https://github.com/KDreynolds/HoTMiXer).

## Areas Needing Work

1. **More backends** — always looking to add frameworks. If yours isn't here, open an issue.
2. **Hot-reloading** — would be nice, needs design work across disparate backends.
3. **Dynamic Laravel scaffolding** — currently copies a full skeleton. Generating it at scaffold time (like Django) would shrink the npm package significantly.
4. **Dependency pinning** — some backends (Koa, Lisp) lack lockfiles for reproducible installs.
5. **Test suite** — no tests exist yet. A scaffold smoke-test suite would catch regressions early.

## License

MIT. See [LICENSE](https://github.com/KDreynolds/HoTMiXer) for details.
