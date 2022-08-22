
const path = require('path')
const { stopSpinner, clearConsole, chalk } = require('../utils')
const validateProjectName = require('validate-npm-package-name')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Creator = require('./Creator')






/**
 * @description create 命令集合
 * @param {string} name
 * @param {object} options 来自于命令行参数
 */
async function create(name, options) {
  console.log('name', name)

  // 获取用户执行目录
  const cwd = (options.cwd && options.cwd()) || process.cwd()
  // 支持当前目录（已存在目录）
  const inCurrent = name === '.'
  // 项目名称
  let pName = inCurrent ? path.relative('../', cwd) : name
  // 生成目标项目目录
  const targetDir = path.resolve(cwd, name)
  console.log('pName', pName)
  // 校验命名规则
  const result = validateProjectName(name)

  // 错误处理并展示
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(0)
  }

  // 文件目录已存在的处理
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      await clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) return
        console.log('action', action)
        if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  // 最后执行新建的逻辑
  // const creator = new Creator(pName, targetDir, getPromptModules())
  const creator = new Creator(pName, targetDir)

  await creator.create(options)
}


/**
 * @description create 命令调用
 * @param {*}
 * @returns function
 */

module.exports = (...args) => {
  create(...args).catch(err => {
    stopSpinner(false)
    console.log('err', err)
  })
}
