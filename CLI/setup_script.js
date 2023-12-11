const fs = require('fs');
const child_process = require('child_process');
const program = require('commander');
const path = require('path');
const fsExtra = require('fs-extra');

let inquirer;

import('inquirer').then((inq) => {
  inquirer = inq;
  main();
});

function main() {
  program
    .command('create <projectName>')
    .option('-b, --backend <backend>', 'Backend framework')
    .option('-s, --styling <styling>', 'Styling option')
    .action((projectName, options) => {
      if (options.backend && options.styling) {
        createNewProject(projectName, options.backend, options.styling);
      } else {
        inquirer.default.prompt([
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
}

function createNewProject(projectName, backend, frontend) {
    createProjectDirectory(projectName);
    copyTemplateFiles(projectName, backend, frontend);
    installDependencies(projectName, backend);
    initializeGitRepository();
  // Provide instructions
}

function createProjectDirectory(projectName) {
  try {
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName);
      console.log(`Directory ${projectName} created successfully.`);
    } else {
      console.log(`Directory ${projectName} already exists.`);
    }
  } catch (error) {
    console.error(`Error creating directory: ${error}`);
  }
}


function copyTemplateFiles(projectName, backend, frontend) {
  const templateDir = path.join(__dirname, '..', backend, frontend);
  fsExtra.copySync(templateDir, projectName);
  console.log('Template files copied successfully.');
}


function installDependencies(projectName, backend) {
    process.chdir(projectName);
    if (backend === 'node') {
      child_process.execSync('npm install', { stdio: 'inherit' });
    } else if (backend === 'go') {
        child_process.execSync('go get github.com/gin-gonic/gin', { stdio: 'inherit' });
    } else if (backend === 'python') {
      if (!process.env.VIRTUAL_ENV) {
        child_process.execSync('python3 -m venv env', { stdio: 'inherit' });
        child_process.execSync('source env/bin/activate', { stdio: 'inherit' });
      }
      child_process.execSync('pip install -r requirements.txt', { stdio: 'inherit' });
    }
    console.log('Dependencies installed successfully.');
}

function initializeGitRepository() {
    try {
      child_process.execSync('git init', { stdio: 'inherit' });
      console.log('Git repository initialized successfully.');
    } catch (error) {
      console.error(`Error initializing Git repository: ${error}`);
    }
}