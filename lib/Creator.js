const { commands } = require('commander')
const EventEmitter = require('events')
const {
  hasGit,
  hasProjectGit,
  execa,
  writeFileTree
} = require('../utils')





/**
 * @description creator 构造类
 * @param {string} name
 * @param {object} context
 * @param {object} promptModules
 */

module.exports = class Creator extends EventEmitter {
  constructor (name, context, promptModules) {
    super()

    this.name = name
    // 自定义环境变量
    this.context = process.env.FISH_CLI_CONTEXT = context
  }

  // create 核心
  async create (cliOptions, preset = null) {
    const { name, context } = this
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }

    // test在某个目录下写文件
    await writeFileTree(context, {
      'package.json': JSON.stringify(pkg, null, 2)
    })

    // 大部分文件生成交给 Generator
  }

  // 开启子进程执行命令
  run (command, args) {
    if (!args) {
      // 参数分配
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, {cwd: this.context})
  }

  // 是否初始化git  return boolean
  shouldInitGit(cliOptions) {
    if (!hasGit) {
      return false
    }
    if (cliOptions.forceGit) {
      return true
    }
    if (cliOptions.git === false || cliOptions.git === 'false') {
      return false
    }
    // 提供默认值
    return !hasProjectGit(this.context)
  }
}
