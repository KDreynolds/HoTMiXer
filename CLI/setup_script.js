#!/usr/bin/env node

import fs from 'fs';
import child_process from 'child_process';
import program from 'commander';
import path from 'path';
import fsExtra from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frameworkToFolder = {
  'Flask': 'flask',
  'Django': 'django',
  'Gin': 'gin',
  'Echo': 'echo',
  'Express': 'node',
  'Koa': 'koa', 
  'Laravel': 'laravel',
  'Actix Web': 'rust',
  'Axum': 'rust_axum',
  'Mongoose': 'mongoose',
  'Clack/Ten': 'clack-ten',
  'Clack/Djula': 'clack-djula',
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createNewProject(projectName, backend) {
  switch(backend) {
    case 'Django':
      installDjango();
      startDjangoProject(projectName);
      await sleep(500);
      configureDjangoSettings(projectName);
      await sleep(500);
      createTemplatesDirectory(projectName);
      await sleep(500);
      copyStaticFiles(projectName);
      await sleep(500);
      createIndexView(projectName);
      await sleep(500);
      installDependencies(projectName, backend);
      break;
    case 'Laravel':
      copyLaravelProject(projectName);
      await sleep(500);
      installComposerDependencies(projectName);
      await sleep(500);
      initializeGitRepository();
      await sleep(500);
      provideInstructions(backend);
      await sleep(500);
      createProjectDirectory(projectName);
      await sleep(500);
      copyTemplateFiles(projectName, backend);
      break;
    case 'Clack/Ten':
      createProjectDirectory(projectName);
      await sleep(500);
      copyTemplateFiles(projectName, backend);
      await sleep(500);
      createLispSystem(projectName, ["clack", "ningle", "ten"], `(:ten-template "templates" :file-extension "html")`);
      await sleep(500);
      createMainLisp(projectName, backend) ;
      break;
    case 'Clack/Djula':
      createProjectDirectory(projectName);
      await sleep(500);
      copyTemplateFiles(projectName, backend);
      await sleep(500);
      createLispSystem(projectName, ["clack", "ningle", "djula"], ``);
      await sleep(500);
      createMainLisp(projectName, backend) ;
      break;
    default:
      createProjectDirectory(projectName);
      await sleep(500);
      copyTemplateFiles(projectName, backend);
      await sleep(500);
      installDependencies(projectName, backend);
      await sleep(500);
      createMainLisp(projectName, backend) ;
      break;
  }
  await sleep(500);
  initializeGitRepository();
  await sleep(500);
  provideInstructions(backend);
}

function installDjango() {
  const spinner = ora('Installing Django').start();
  try {
    child_process.execSync('pip install django', { stdio: 'inherit' });
    spinner.succeed(chalk.green('Django installed successfully.'));
  } catch (error) {
    spinner.info(chalk.yellow(`Error installing Django with pip: ${error}. Trying with pip3...`));
    try {
      child_process.execSync('pip3 install django', { stdio: 'inherit' });
      spinner.succeed(chalk.green('Django installed successfully with pip3.'));
    } catch (error) {
      spinner.info(chalk.yellow(`Error installing Django with pip3: ${error}. Trying with pacman...`));
      try {
        child_process.execSync('sudo pacman -S python-django', { stdio: 'inherit' });
        spinner.succeed(chalk.green('Django installed successfully with pacman.'));
      } catch (error) {
        spinner.fail(chalk.red(`Error installing Django with pacman: ${error}`));
      }
    }
  }
}

function startDjangoProject(projectName) {
  const spinner = ora('Starting Django project').start();
  try {
    if (['test', 'other disallowed names...'].includes(projectName.toLowerCase())) {
      throw new Error(`'${projectName}' conflicts with the name of an existing Python module and cannot be used as a project name. Please try another name.`);
    }
    child_process.execSync(`django-admin startproject ${projectName}`, { stdio: 'inherit' });
    process.chdir(projectName);
    console.log(`Current working directory: ${process.cwd()}`);
    spinner.succeed(chalk.green('Django project started successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error starting Django project: ${error}`));
  }
}



function createIndexView(projectName) {
  const spinner = ora('Creating index view').start();
  try {
    const templatesDir = path.join(process.cwd(), projectName, 'templates');
    const indexPath = path.join(templatesDir, 'index.html');
    const viewsPath = path.join(process.cwd(), projectName, 'views.py');
    const urlsPath = path.join(process.cwd(), projectName, 'urls.py');
    const indexCode = `
<!DOCTYPE html>
{% load static %}
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to HoTMiXer!</title>
    <link rel="stylesheet" type="text/css" href="{% static 'style.css' %}">
    <script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>
</head>
<body>
    <img src="{% static 'hotmix_logo.png' %}" alt="HotMiXer Logo">
    <h1>Welcome to HoTMiXer!</h1>
    <p>Edit this file to start building your application.</p>
    
    <div id="update-div">
        It is so over...
</div>
<button hx-get="/endpoint" hx-trigger="click" hx-target="#update-div" hx-swap="outerHTML">
    Click Me!
</button>
<div class="link-container">
    <a href="https://htmx.org/docs/" target="_blank">Learn more about HTMX</a>
    <a href="https://docs.djangoproject.com/en/5.0/" target="_blank">Learn more about Django</a>
</div>
</body>
</html>
`;
    fs.writeFileSync(indexPath, indexCode);

    // Create views.py
    const viewsCode = `
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

def endpoint(request):
    return HttpResponse('We are so back!')
`;
    fs.writeFileSync(viewsPath, viewsCode);

    // Create urls.py
    const urlsCode = `
from django.urls import path
from .views import index, endpoint

urlpatterns = [
    path('', index, name='index'),
    path('endpoint', endpoint, name='endpoint'),
]
`;
    fs.writeFileSync(urlsPath, urlsCode);

    spinner.succeed(chalk.green('Index view created successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error creating index view: ${error}`));
  }
}

function configureDjangoSettings(projectName) {
  const spinner = ora('Configuring Django settings').start();
  try {
    const settingsPath = path.join(process.cwd(), projectName, 'settings.py');
    let settings = fs.readFileSync(settingsPath, 'utf8');

    // Add import os statement at the top
    settings = "import os\n" + settings;

    // Add templates directory to TEMPLATES setting
    settings = settings.replace("'DIRS': [],", `'DIRS': [BASE_DIR / '${projectName}' / 'templates'],`);

    // Add STATIC_ROOT setting
    settings += "\nSTATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')\n";

    // Add STATICFILES_DIRS setting
    settings += "\nSTATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'),]\n";

    fs.writeFileSync(settingsPath, settings);
    spinner.succeed(chalk.green('Django settings configured successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error configuring Django settings: ${error}`));
  }
}

function createLispSystem(projectName, dependencies, asdf_template_file_component) {
  const spinner = ora('Setting up asdf system').start();
  const depslist = dependencies.map(d => `"${d}"`).join(" ");
  const system_path = path.join(process.cwd(), projectName, `${projectName}.asd`);
  const system =
`(in-package #:asdf-user)

(defsystem "${projectName}"
  :description ""
  :author ""
  :version "1.0.0"
  :licence ""
  :depends-on (${depslist})
  :components
  ((:module "src"
    :serial t
    :components
     (${asdf_template_file_component}
      (:file "main")))))
`

  try {
    fs.writeFileSync(system_path, system)
    spinner.succeed(chalk.green('Asdf system set up successfully.'));
  } catch {
    spinner.fail('Failed to set up asdf system');
  }
}

function createMainLisp(projectName, backend) {
  const spinner = ora('Creating "main.lisp"');
  const main_lisp = path.join(process.cwd(), projectName, "src", "main.lisp");
  if(backend == 'Clack/Ten') {
    const content =
`(defpackage #:${projectName}
  (:use #:cl))
(in-package #:${projectName})

(defvar *app* (make-instance 'ningle:app))

(setf (ningle:route *app* "/" :method :GET)
  (lambda (args)
    (declare (ignore args))
    (ten-templates:index)))
(setf (ningle:route *app* "/endpoint" :method :GET)
  (lambda (args)
    (declare (ignore args))
    "We're so back!"))

(defun server ()
  (lack:builder
    (:static :path "/public/"
             :root #p"public/")
    *app*))
(defun start ()
  (ten:compile-template "src/templates.html")
  (clack:clackup (server)))

(defvar *server*)
#+nil
(setf *server* (start))
#+nil
(clack:stop *server*)
`;
    fs.writeFileSync(main_lisp, content);
    spinner.succeed(chalk.green("main.lisp created successfully."));
  } else if(backend == 'Clack/Djula') {
    const content =
`(defpackage #:${projectName}
  (:use #:cl))
(in-package #:${projectName})

(defvar *app* (make-instance 'ningle:app))

(setf (ningle:route *app* "/" :method :GET)
  (lambda (args)
    (declare (ignore args))
    (djula:render-template* #p"templates/index.djhtml")))
(setf (ningle:route *app* "/endpoint" :method :GET)
  (lambda (args)
    (declare (ignore args))
    "We're so back!"))

(defun server ()
  (lack:builder
    (:static :path "/public/"
             :root #p"public/")
    *app*))
(defun start ()
  (clack:clackup (server)))

(defvar *server*)
#+nil
(setf *server* (start))
#+nil
(clack:stop *server*)
`;
    fs.writeFileSync(main_lisp, content);
    spinner.succeed(chalk.green("main.lisp created successfully."));
  } else {
    spinner.fail(chalk.red("Unknown backend for Lisp"));
  }
}

function createProjectDirectory(projectName) {
  const spinner = ora('Creating project directory').start();
  try {
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName);
      spinner.succeed(chalk.green(`Directory ${projectName} created successfully.`));
    } else {
      spinner.info(chalk.yellow(`Directory ${projectName} already exists.`));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Error creating directory: ${error}`));
  }
}

function createTemplatesDirectory(projectName) {
  const spinner = ora('Creating templates directory').start();
  const templatesDir = path.join(process.cwd(), projectName, 'templates');
  try {
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir);
      spinner.succeed(chalk.green(`Templates directory created successfully.`));
    } else {
      spinner.info(chalk.yellow(`Templates directory already exists.`));
    }
  } catch (error) {
    spinner.fail(chalk.red(`Error creating templates directory: ${error}`));
  }

}

function copyStaticFiles(projectName) {
  const spinner = ora('Copying static files').start();
  const staticSource = path.join(__dirname, '..', 'django', 'static');
  const staticDestination = path.join(process.cwd(), 'static');
  fsExtra.copySync(staticSource, staticDestination);
  spinner.succeed(chalk.green('Static files copied successfully.'));
}

function copyTemplateFiles(projectName, backend) {
  const spinner = ora('Copying template files').start();
  const frameworkFolderMap = {
    'Flask': 'flask',
    'Django': 'django',
    'Gin': 'gin',
    'Express': 'node',
    'Laravel': 'laravel',
    'Actix Web': 'rust',
    'Axum': 'rust_axum',
    'Echo': 'echo',
    'Mongoose': 'mongoose',
    'Clack/Ten': 'clack-ten',
    'Clack/Djula': 'clack-djula',
  };

  // Translate the backend name to the correct folder name
  const backendFolder = frameworkFolderMap[backend] || backend;
  const templateDir = path.join(__dirname, '..', backendFolder);

  fsExtra.copySync(templateDir, projectName);
  spinner.succeed(chalk.green('Template files copied successfully.'));

  // Existing functionality for Flask remains unchanged
  if (backend === 'Flask') {
    const requirementsSource = path.join(__dirname, '..', 'flask', 'requirements.txt');
    const requirementsDestination = path.join(projectName, 'requirements.txt');
    fsExtra.copySync(requirementsSource, requirementsDestination);
    spinner.succeed(chalk.green('requirements.txt copied successfully.'));
  }
}

function copyLaravelProject(projectName) {
  const spinner = ora('Copying Laravel project').start();
  const templateDir = path.join(__dirname, '..', 'laravel');
  fsExtra.copySync(templateDir, projectName);
  spinner.succeed(chalk.green('Laravel project copied successfully.'));

  // Copy .env.example to .env
  const envExamplePath = path.join(projectName, '.env.example');
  const envPath = path.join(projectName, '.env');
  fsExtra.copySync(envExamplePath, envPath);
  spinner.succeed(chalk.green('.env file created successfully.'));
}

function installComposerDependencies(projectName) {
  const spinner = ora('Installing Composer dependencies').start();
  process.chdir(projectName);
  try {
    child_process.execSync('composer install', { stdio: 'inherit' });
    spinner.succeed(chalk.green('Composer dependencies installed successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error installing Composer dependencies: ${error}`));
  }
}

function installDependencies(projectName, backend) {
  const spinner = ora('Installing dependencies').start();
  process.chdir(projectName);

  try {
    switch (backend) {
      // ...
      case 'Echo':
        child_process.execSync('go get github.com/labstack/echo/v4', { stdio: 'inherit' });
        child_process.execSync('go get github.com/labstack/echo/v4/middleware', { stdio: 'inherit' });
        break;
      // ...
    }
    spinner.succeed(chalk.green('Dependencies installed successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error installing dependencies: ${error}`));
  }
}

function initializeGitRepository() {
  const spinner = ora('Initializing Git repository').start();
  try {
    child_process.execSync('git init -b main', { stdio: 'inherit' });
    spinner.succeed(chalk.green('Git repository initialized successfully.'));
  } catch (error) {
    spinner.fail(chalk.red(`Error initializing Git repository: ${error}`));
  }
}

function provideInstructions(backend) {
  const spinner = ora('Providing instructions').start();
  spinner.succeed();
  console.log(chalk.green(`\nProject setup complete! Here's how to get started:\n`));

  switch (backend) {
    case 'Flask':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Create a Python virtual environment with 'python -m venv env'.
3. Activate the virtual environment with 'source env/bin/activate' (on Unix or MacOS) or '.\\env\\Scripts\\activate' (on Windows).
4. Run 'pip install -r requirements.txt' to install dependencies.
5. Run 'flask run' to start the server.
6. Visit the Flask documentation for more information: https://flask.palletsprojects.com/`));
      break;
    case 'Gin':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'go run main.go' to start the server.
3. Visit the Gin documentation for more information: https://gin-gonic.com/docs/`));
      break;
    case 'Echo':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'go run main.go' to start the server.
3. Visit the Echo documentation for more information: https://echo.labstack.com/guide`));
      break;
    case 'Django':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'python manage.py migrate' to migrate settings.
3. Run 'python manage.py collectstatic'.
3. Run 'python manage.py runserver' to start the server.
4. Visit the Django documentation for more information: https://docs.djangoproject.com/`));
      break;
    case 'Express':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'npm install' to install dependencies.
3. Run 'node app.js' to start the server.
4. Visit the Express documentation for more information: https://expressjs.com/`));
      break;
    case 'Koa':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'npm install' to install dependencies.
3. Run 'node app.js' to start the server.
4. Visit the Express documentation for more information: https://koajs.com/`));
      break;
    case 'Laravel':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'composer install' to install dependencies.
3. Run 'php artisan key:generate.
3. Run 'php artisan serve' to start the server.
4. Visit the Laravel documentation for more information: https://laravel.com/docs/`));
      break;
    case 'Actix Web':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'cargo build' to build the project.
3. Run 'cargo run' to start the server.
4. Visit the Rust documentation for more information: https://doc.rust-lang.org/book/`));
      break;
    case 'Axum':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'cargo build' to build the project.
3. Run 'cargo run' to start the server.
4. Visit the Axum documentation for more information: https://github.com/tokio-rs/axum`));
      break;
      case 'Mongoose':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Compile the server code (you will need a c compiler like gcc or clang): clang main.c mongoose.c -o server.exe -DMG_ENABLE_HTTP=1
3. Run the server: ./server
4. Open your browser and go to http://localhost:8000
5. For more information on Mongoose, visit: https://mongoose.ws/`));
      break;
      case 'Clack/Ten':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Start up your repl/slime
3. Load the asdf system, and switch to your package
4. Call the 'start' function to start the server
5. Load code onto the repl dynamically, and develop interactively!
6. For more information, just 'describe' the symbol you want, or for detailed information see:
   https://github.com/fukamachi/lack: For the web framework, Clack/Lack
   https://github.com/mmontone/ten: For the templating engine, Ten
   https://github.com/fukamachi/ningle: For the router, Ningle`));
      break;
      case 'Clack/Djula':
      console.log(chalk.blue(`1. Navigate to your project directory.
2. Start up your repl/slime
3. Load the asdf system, and switch to your package
4. Call the 'start' function to start the server
5. Load code onto the repl dynamically, and develop interactively!
6. For more information, just 'describe' the symbol you want, or for detailed information see:
   https://github.com/fukamachi/lack: For the web framework, Clack/Lack
   https://mmontone.github.io/djula/djula/: For the templating engine, Djula
   https://github.com/fukamachi/ningle: For the router, Ningle`));
      break;
    default:
      console.log(chalk.red(`Please refer to the documentation for your chosen backend technology.`));
  }
}

const languageToFrameworks = {
  Python: ['Flask', 'Django'],
  Go: ['Gin', 'Echo'],
  Node: ['Express', 'Koa'],
  PHP: ['Laravel'],
  Rust: ['Actix Web', 'Axum'],
  C: ['Mongoose'],
  Lisp: ['Clack/Ten', 'Clack/Djula']
};

program
  .command('create <projectName>')
  .option('-b, --backend <backend>', 'Backend framework')
  .action((projectName, options) => {
    if (options.backend) {
      createNewProject(projectName, options.backend);
    } else {
      inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: 'Which programming language would you like to use for your backend?',
          choices: Object.keys(languageToFrameworks),
        }
      ]).then(answers => {
        const language = answers.language;
        const frameworks = languageToFrameworks[language];

        if (frameworks.length > 1) {
          inquirer.prompt([
            {
              type: 'list',
              name: 'backend',
              message: 'Which web framework would you like to use?',
              choices: frameworks,
            }
          ]).then(answers => {
            createNewProject(projectName, answers.backend);
          });
        } else {
          createNewProject(projectName, frameworks[0]);
        }
      });
    } 
  });

program.parse(process.argv);
