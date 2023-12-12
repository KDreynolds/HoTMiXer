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