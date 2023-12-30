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

console.log(chalk.green('Script started')); // New log statement

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createNewProject(projectName, backend, frontend) {
    if (backend === 'django') {
        installDjango();
        startDjangoProject(projectName);
        await sleep(500);
        configureDjangoSettings(projectName);
        await sleep(500);
        createTemplatesDirectory(projectName);
        await sleep(500);
        createIndexTemplate(projectName);
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
    copyTemplateFiles(projectName, backend, frontend);
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

function createIndexTemplate(projectName) {
    const spinner = ora('Creating index template').start();
    try {
        const templatesDir = path.join(process.cwd(), projectName, 'templates');
        const indexPath = path.join(templatesDir, 'index.html');

        // Create index.html
        const indexCode = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to HoTMiX!</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.3/css/bulma.min.css">
        </head>
        <body>
            <header class="hero is-dark">
                <div class="hero-body">
                    <h1 class="title">Welcome to HoTMiX!</h1>
                </div>
            </header>
            <main id="main-content" class="section">
                <section class="welcome-section">
                    <h2 class="title">Your project has been successfully created with HoTMiX!</h2>
                    <p>This is a simple SPA template integrated with HTMX. You can modify this template to start building your application.</p>
                    <a href="https://htmx.org/docs/" target="_blank" class="htmx-docs-link button is-link">Learn more about HTMX</a>
                </section>
                <section id="data-section" class="section">
                    <h2 class="title">Data Table</h2>
                    <table id="data-table" class="table is-fullwidth">
                        <!-- Table Headers -->
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                        <!-- Data Rows Fetched from Backend -->
                        {% for item in items %}
                        <tr>
                            <td>{{ item.id }}</td>
                            <td>{{ item.name }}</td>
                            <td>
                                <!-- Action buttons -->
                            </td>
                        </tr>
                        {% endfor %}
                    </table>
                    <button hx-get="/new_item_form" hx-target="#modal" hx-toggle="modal" class="button is-primary">Add New Item</button>
                </section>
                
                <!-- Modal for Adding/Editing Items -->
                <div id="modal" class="modal">
                    <!-- Content loaded dynamically by HTMX -->
                </div>
            </main>
            <footer class="footer">
                <p>Created with HoTMiX - Your HTMX scaffolding tool.</p>
            </footer>
            <script src="https://unpkg.com/htmx.org"></script>
            <!-- <script src="script.js"></script> -->
        </body>
        </html>
`;
        fs.writeFileSync(indexPath, indexCode);

        spinner.succeed(chalk.green('Index template created successfully.'));
    } catch (error) {
        spinner.fail(chalk.red(`Error creating index template: ${error}`));
    }
}

function createIndexView(projectName) {
    const spinner = ora('Creating index view').start();
    try {
        const viewsPath = path.join(process.cwd(), projectName, 'views.py');
        const urlsPath = path.join(process.cwd(), projectName, 'urls.py');

        // Create views.py
        const viewsCode = `
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')
`;
        fs.writeFileSync(viewsPath, viewsCode);

        // Create urls.py
        const urlsCode = `
from django.urls import path
from .views import index

urlpatterns = [
    path('', index, name='index'),
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

        // Add templates directory to TEMPLATES setting
        settings = settings.replace("'DIRS': [],", `'DIRS': [BASE_DIR / '${projectName}' / 'templates'],`);

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
    try {
        const templatesDir = path.join(process.cwd(), projectName, 'templates');
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

function copyTemplateFiles(projectName, backend, frontend) {
    const spinner = ora('Copying template files').start();
    const templateDir = path.join(__dirname, '..', backend, frontend);
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
3. Run 'python manage.py runserver' to start the server.
4. Visit the Django documentation for more information: https://docs.djangoproject.com/`));
            break;
        case 'node':
            console.log(chalk.blue(`1. Navigate to your project directory.
2. Run 'npm install' to install dependencies.
3. Run 'npm start' to start the server.
4. Visit the Express documentation for more information: https://expressjs.com/`));
            break;
        default:
            console.log(chalk.red(`Please refer to the documentation for your chosen backend technology.`));
    }
    spinner.succeed(chalk.green('Instructions provided successfully.'));
}

program
  .command('create <projectName>')
  .option('-b, --backend <backend>', 'Backend framework')
  .option('-s, --styling <styling>', 'Styling option')
  .action((projectName, options) => {
    console.log(`Command received: create ${projectName}`);
        if (options.backend && options.styling) {
            createNewProject(projectName, options.backend, options.styling);
        } else {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'backend',
                    message: 'Which backend would you like to use?',
                    choices: ['flask', 'gin', 'node', 'django'],
                },
                {
                    type: 'list',
                    name: 'styling',
                    message: 'Which styling would you like to use?',
                    choices: ['regular', 'tailwind', 'bulma', 'bootstrap'],
                },
            ]).then(answers => {
                createNewProject(projectName, answers.backend, answers.styling);
            });
        }
    });

program.parse(process.argv);