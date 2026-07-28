#!/usr/bin/env bash
# HoTMiXer Test Suite — smoke test all 12 backends
set -eo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="$HOME/.local/bin:$PATH"
CLI="node $ROOT/CLI/setup_script.js"

PASS=0; FAIL=0; SKIP=0; FAILS=()
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

killport() { fuser -k -9 "${1}/tcp" 2>/dev/null; sleep 0.5; }
waitport() { for ((i=0; i<90; i++)); do curl -s -o /dev/null --max-time 1 "http://localhost:$1/" 2>/dev/null && return 0; sleep 0.5; done; return 1; }
DOCKER_USER="$(id -u):$(id -g)"

scaffold_project() {
    local backend="$1" name="$2" proj="$3"
    local scaf="/tmp/hotmixer-scaf-$$-$RANDOM"
    mkdir -p "$scaf"
    (cd "$scaf" && $CLI create "$name" --backend "$backend") > /dev/null 2>&1
    # Find the created project directory
    local created=$(find "$scaf" -maxdepth 2 -name "$name" -type d 2>/dev/null | head -1)
    if [ -z "$created" ]; then
        # CLI may have cd'd inside and created files directly
        created=$(find "$scaf" -maxdepth 1 -name "app.py" -o -name "main.go" -o -name "main.c" -o -name "manage.py" 2>/dev/null | head -1)
        [ -n "$created" ] && created="$scaf"
    fi
    if [ -z "$created" ] || [ ! -d "$created" ]; then
        rm -rf "$scaf" 2>/dev/null; return 1
    fi
    rm -rf "$proj" 2>/dev/null
    mv "$created" "$proj" 2>/dev/null
    rm -rf "$scaf" 2>/dev/null
    [ -d "$proj" ]
}

start_server_and_verify() {
    local proj="$1" port="$2" start="$3" endpoint="${4:-/endpoint}" expected="${5:-We are so back!}"
    killport "$port"
    (cd "$proj" && eval "$start") &
    local pid=$!
    if ! waitport "$port"; then
        kill "$pid" 2>/dev/null; wait "$pid" 2>/dev/null; killport "$port"; return 1
    fi
    local idx=$(curl -s --max-time 5 "http://localhost:$port/" 2>/dev/null)
    local ep=$(curl -s --max-time 5 "http://localhost:$port$endpoint" 2>/dev/null)
    kill "$pid" 2>/dev/null; wait "$pid" 2>/dev/null
    pkill -9 -P "$pid" 2>/dev/null || true
    killport "$port"
    [ -n "$idx" ] && echo "$idx" | grep -q "HoTMiXer" && echo "$ep" | grep -qF "$expected"
}

run_test() {
    local label="$1" backend="$2" name="$3" install="$4" start="$5" port="$6"
    local endpoint="${7:-/endpoint}" expected="${8:-We are so back!}" skip="${9:-}"
    local proj="/tmp/hotmixer-test-$name-$$"

    echo -e "${CYAN}━━━ $label${NC}"
    if [ -n "$skip" ]; then
        echo -e "  ${YELLOW}SKIP${NC} ($skip)"; SKIP=$((SKIP + 1)); return
    fi
    rm -rf "$proj" 2>/dev/null || true

    if ! scaffold_project "$backend" "$name" "$proj"; then
        echo -e "  ${RED}FAIL${NC}: scaffold"; FAIL=$((FAIL + 1)); FAILS+=("$label: scaffold"); return
    fi

    if [ -n "$install" ] && ! (cd "$proj" && eval "$install" 2>/dev/null); then
        echo -e "  ${RED}FAIL${NC}: install"; FAIL=$((FAIL + 1)); FAILS+=("$label: install"); return
    fi

    if start_server_and_verify "$proj" "$port" "$start" "$endpoint" "$expected"; then
        echo -e "  ${GREEN}PASS${NC}"; PASS=$((PASS + 1))
    else
        echo -e "  ${RED}FAIL${NC}: serve/verify"; FAIL=$((FAIL + 1)); FAILS+=("$label: serve/verify")
    fi
    rm -rf "$proj" 2>/dev/null || true
}

echo ""; echo -e "${CYAN}═══ HoTMiXer Test Suite v1.0.1 ═══${NC}"; echo ""

# ============================================
run_test "Flask" "Flask" "flask" \
    'python3 -m venv venv && ./venv/bin/pip install -q -r requirements.txt' \
    './venv/bin/python -c "from app import app; app.run(debug=False, port=5000)"' 5000

run_test "Django" "Django" "djtest" \
    'python3 -m venv venv && ./venv/bin/pip install -q django && ./venv/bin/python manage.py migrate --run-syncdb 2>/dev/null' \
    './venv/bin/python manage.py runserver 0.0.0.0:8004 --noreload' 8004

run_test "Gin" "Gin" "gin" 'go mod tidy' 'go run main.go' 8080

run_test "Echo" "Echo" "echo" 'go mod tidy' 'go run main.go' 8080

run_test "Express" "Express" "express" 'npm install --silent' 'node app.js' 3000

run_test "Koa" "Koa" "koa" 'npm install --silent' 'node app.js' 3000

LARAVEL_SKIP=""
command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1 || LARAVEL_SKIP="Docker unavailable"
run_test "Laravel" "Laravel" "laravel" \
    'rm -f composer.lock; docker run --rm --user '"$DOCKER_USER"' -v "$(pwd)":/app -w /app composer install --ignore-platform-req=php --no-interaction --quiet && docker run --rm --user '"$DOCKER_USER"' -v "$(pwd)":/app -w /app php:cli php artisan key:generate --quiet' \
    'docker run --rm -p 8000:8000 -v "$(pwd)":/app -w /app php:cli php artisan serve --host=0.0.0.0 --port=8000' \
    8000 "/endpoint" "We are so back!" "$LARAVEL_SKIP"

run_test "Actix Web" "Actix Web" "actix" 'cargo build -q 2>/dev/null || cargo build -q' './target/debug/backend' 8080

run_test "Axum" "Axum" "axum" 'cargo build -q 2>/dev/null || cargo build -q' './target/debug/rust_axum' 8000 "/api/hello"

run_test "Mongoose" "Mongoose" "mongoose" \
    'gcc main.c mongoose.c -o server -DMG_ENABLE_HTTP=1' './server' 8000

# ============================================
# Lisp: scaffold + ASDF load verification
# ============================================
CLACK_SKIP=""
command -v sbcl >/dev/null 2>&1 && sbcl --noinform --eval '(progn (load "~/quicklisp/setup.lisp") (sb-ext:quit))' 2>/dev/null || CLACK_SKIP="SBCL/Quicklisp unavailable"

_clack_verify() {
    local label="$1" backend="$2" name="$3" ql_deps="$4"
    local proj="/tmp/hotmixer-test-$name-$$"
    echo -e "${CYAN}━━━ $label${NC}"
    if [ -n "$CLACK_SKIP" ]; then
        echo -e "  ${YELLOW}SKIP${NC} ($CLACK_SKIP)"; SKIP=$((SKIP + 1)); return
    fi
    rm -rf "$proj" 2>/dev/null || true
    if ! scaffold_project "$backend" "$name" "$proj"; then
        echo -e "  ${RED}FAIL${NC}: scaffold"; FAIL=$((FAIL + 1)); FAILS+=("$label: scaffold"); return
    fi
    export PATH="$HOME/.local/bin:$PATH"
    if (cd "$proj" && sbcl --noinform --load ~/quicklisp/setup.lisp \
        --eval "(handler-case (progn $ql_deps (asdf:load-asd (merge-pathnames #p\"$name.asd\" (uiop:getcwd))) (ql:quickload :$name :verbose nil)) (error (e) (format t \"QL-ERROR: ~a~%\" e) (sb-ext:quit :unix-status 1)))" \
        --eval "(format t \"CLACK-LOAD-OK~%\")" --eval "(sb-ext:quit)" 2>&1 | grep -q "CLACK-LOAD-OK"); then
        echo -e "  ${GREEN}PASS${NC}"; PASS=$((PASS + 1))
    else
        echo -e "  ${RED}FAIL${NC}: ASDF load"; FAIL=$((FAIL + 1)); FAILS+=("$label: load")
    fi
    rm -rf "$proj" 2>/dev/null || true
}

_clack_verify "Clack/Ten" "Clack/Ten" "tclackten" \
    "(ql:quickload :ten :verbose nil) (ql:quickload :clack :verbose nil) (ql:quickload :ningle :verbose nil) (ql:quickload :lack :verbose nil)"

_clack_verify "Clack/Djula" "Clack/Djula" "tclackdjula" \
    "(ql:quickload :djula :verbose nil) (ql:quickload :clack :verbose nil) (ql:quickload :ningle :verbose nil) (ql:quickload :lack :verbose nil)"

# ============================================
echo ""; echo -e "${CYAN}══════ Results ══════${NC}"
echo -e "  ${GREEN}PASS${NC}: $PASS  ${RED}FAIL${NC}: $FAIL  ${YELLOW}SKIP${NC}: $SKIP"
[ ${#FAILS[@]} -gt 0 ] && { for f in "${FAILS[@]}"; do echo -e "  ${RED}✗${NC} $f"; done; }
echo ""
rm -rf /tmp/hotmixer-test-* /tmp/hotmixer-scaf-* 2>/dev/null || true
[ "$FAIL" -eq 0 ]
