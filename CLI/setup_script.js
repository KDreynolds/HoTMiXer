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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createNewProject(projectName, backend) {
    if (backend === 'django') {
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
        await sleep(500);
        initializeGitRepository();
        await sleep(500);
        provideInstructions(backend);
    } else {
    await sleep(500); // Delay of 0.5 seconds
    createProjectDirectory(projectName);
    await sleep(500); // Delay of 0.5 seconds
    copyTemplateFiles(projectName, backend);
    await sleep(500); // Delay of 0.5 seconds
    installDependencies(projectName, backend);
    await sleep(500); // Delay of 0.5 seconds
    initializeGitRepository();
    await sleep(500); // Delay of 0.5 seconds
    provideInstructions(backend); // Provide instructions based on the chosen backend
    }
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
    const templateDir = path.join(__dirname, '..', backend);
    fsExtra.copySync(templateDir, projectName);
    spinner.succeed(chalk.green('Template files copied successfully.'));

    // If the backend is Flask, copy the requirements.txt file
    if (backend === 'flask') {
        const requirementsSource = path.join(__dirname, '..', 'flask', 'requirements.txt');
        const requirementsDestination = path.join(projectName, 'requirements.txt');
        fsExtra.copySync(requirementsSource, requirementsDestination);
        spinner.succeed(chalk.green('requirements.txt copied successfully.'));
    }
}


function installDependencies(projectName, backend) {
    const spinner = ora('Installing dependencies').start();
    process.chdir(projectName);
    // Rest of the code...
    spinner.succeed(chalk.green('Dependencies installed successfully.'));
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
        case 'flask':
            console.log(chalk.blue(`1. Navigate to your project directory.
2. Create a Python virtual environment with 'python -m venv env'.
3. Activate the virtual environment with 'source env/bin/activate' (on Unix or MacOS) or '.\\env\\Scripts\\activate' (on Windows).
4. Run 'pip install -r requirements.txt' to install dependencies.
5. Run 'flask run' to start the server.
6. Visit the Flask documentation for more information: https://flask.palletsprojects.com/`));
            break;
        case 'gin':
            console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'go run main.go' to start the server.
3. Visit the Gin documentation for more information: https://gin-gonic.com/docs/`));
            break;
        case 'django':
            console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'python manage.py migrate' to migrate settings.
3. Run 'python manage.py collectstatic'.
3. Run 'python manage.py runserver' to start the server.
4. Visit the Django documentation for more information: https://docs.djangoproject.com/`));
            break;
        case 'node':
            console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'npm install' to install dependencies.
3. Run 'node app.js' to start the server.
4. Visit the Express documentation for more information: https://expressjs.com/`));
            break;
        default:
            console.log(chalk.red(`Please refer to the documentation for your chosen backend technology.`));
    }
}

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
                    name: 'backend',
                    message: 'Which backend would you like to use?',
                    choices: ['flask', 'gin', 'node', 'django'],
                },
            ]).then(answers => {
                createNewProject(projectName, answers.backend);
            });
        }
    });

program.parse(process.argv);