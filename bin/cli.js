#!/usr/bin/env node
// 存在 node 包只支持esm,但是在node 环境不兼容,这里降低chalk版本
const { chalk, semver } = require('../utils')
const requireVerson = require('../package.json').engines.node
const program = require('commander')
const leven = require('leven')
const minimist = require('minimist')



/**
 * @description 校验node版本，避免出现不一致的预期
 * @param
 */

function checkNodeversion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
    'You are using Node ' + process.version + ', but this version of ' + id +
    ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))

    process.exit(1)
  }
}

checkNodeversion(requireVerson, 'my-cli')



/**
 * @description cli命令行交互的完整性
 *  1. 命令行交互场景&边界性
 *  2. create
 *    2.1
 *
 */
program
  .version(`fish-cli ${require('../package').version}`)
  .usage('<command> [options]')

// 可以使用minimist处理参数
program
  .command('create <app-name>')
  .description('use fish to create your project')
  .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
  .action((name, options) => {
    console.log('zz', minimist(process.argv.slice(2)))
    console.log('name', name)
    console.log('option', options)

    // 控制指令本身
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/create')(name, options)
  })

// 全局help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`fish <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// 每一个指令的help
program.commands.forEach(c => c.on('--help', () => console.log()))


// 处理任意命令兜底,前面未命中的会走到这里
program.on('command:*', ([cmd]) => {
  // 自带的help工具
  program.outputHelp()
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  suggestCommands(cmd)
  process.exitCode = 1
})

// 接受所有命令行参数
program.parse(process.argv)


// 对任意命令的最佳提示
function suggestCommands(unknowCommand) {
  // 获取所有的注册命令
  const availableCommand = program.commands.map(cmd => cmd._name)
  let suggestTion

  availableCommand.forEach(cmd => {
    const isBestMatch = leven(cmd, unknowCommand) < leven(suggestTion || '', unknowCommand)
    if (leven(cmd, unknowCommand) < 3 && isBestMatch) {
      suggestTion = cmd
    }
  })

  if (suggestTion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}
