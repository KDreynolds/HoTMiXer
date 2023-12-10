const fs = require('fs');
const child_process = require('child_process');
const program = require('commander');
const inquirer = require('inquirer');

program
  .command('create <projectName>')
  .option('-b, --backend <backend>', 'Backend framework')
  .option('-f, --frontend <frontend>', 'Frontend framework')
  .action((projectName, options) => {
    if (options.backend && options.frontend) {
      createNewProject(projectName, options.backend, options.frontend);
    } else {
      inquirer.prompt([
        // Add your questions here
      ]).then(answers => {
        createNewProject(projectName, answers.backend, answers.frontend);
      });
    }
  });

program.parse(process.argv);

function createNewProject(projectName, backend, frontend) {
    createProjectDirectory(projectName);
    copyTemplateFiles(projectName, backend, frontend);
    installDependencies(projectName, backend);
    initializeGitRepository();
  // Provide instructions
}

function createProjectDirectory(projectName) {
    try {
      fs.mkdirSync(projectName);
      console.log(`Directory ${projectName} created successfully.`);
    } catch (error) {
      console.error(`Error creating directory: ${error}`);
    }
}


function copyTemplateFiles(projectName, backend, frontend) {
    const templateDir = `${backend}/${frontend}`;
    fs.readdirSync(templateDir).forEach(file => {
      fs.copyFileSync(`${templateDir}/${file}`, `${projectName}/${file}`);
    });
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