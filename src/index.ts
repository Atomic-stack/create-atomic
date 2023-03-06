#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import * as ejs from 'ejs'

//define message type and reuse them whenever you want
const warning = chalk.bold.yellow
const info = chalk.bold.blue
const error = chalk.bold.red
const success = chalk.bold.green

const filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(filename)

const templates = fs.readdirSync(path.join(__dirname, 'templates'))

const CURR_DIR = process.cwd()

// list of file/folder that should not be copied
const IGNORE = ['node_modules', '.template.json']

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What kind of project is this?',
    choices: templates
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true
      else return 'Project name may only include letters, numbers, underscores and hashes.'
    }
  }
]

await inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers['template']
  const projectName = answers['name']
  const templatePath = path.join(__dirname, 'templates', projectChoice)
  const targetPath = path.join(CURR_DIR, projectName)
  const options = {
    projectName,
    templateName: projectChoice,
    templatePath,
    targetPath
  }

  console.log(info('Creating your project ...\n'))

  if (!createProject(targetPath)) {
    return
  }

  createDirectoryContents(templatePath, projectName)

  console.log(success('Done. ✨ Now run this:\n'))

  console.log(` cd ${projectName}`)
  console.log(` npm install`)
  console.log(` npm start`)
})

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(error(`Folder ${projectPath} exists. Delete or use another name.`))
    return false
  }
  fs.mkdirSync(projectPath)

  return true
}

function createDirectoryContents(templatePath: string, projectName: string) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath)
  // loop each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file)

    // get stats about the current file
    const stats = fs.statSync(origFilePath)

    // skip files that should not be copied
    if (IGNORE.indexOf(file) > -1) return

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, 'utf8')
      contents = ejs.render(contents, { projectName })
      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectName, file)
      fs.writeFileSync(writePath, contents, 'utf8')
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(CURR_DIR, projectName, file))
      // copy files/folder inside current folder recursively
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file))
    }
  })
}
