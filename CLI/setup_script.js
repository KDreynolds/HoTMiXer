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
    console.log(chalk.blue(`Creating new project: ${projectName}`)); // New log statement
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
                    choices: ['flask', 'gin', 'node'],
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