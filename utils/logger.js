/**
 * @description 命令行封装统一的打印工具,避免重复调用打印函数
 *
 *
 */

const chalk = require('chalk')
const { stopSpinner } = require('./spinner')
const readline = require('readline')
const { read } = require('fs')


exports.clearConsole = title => {
  // 是terminal/node环境
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}
