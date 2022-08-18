/**
 * @description 命令行统一的loading
 *  1. 看起来是单例模式
 *
 */

const ora = require('ora')
const chalk = require('chalk')

const spinner = ora()
// 保留全局状态
let lastMsg
let isPaused = false

exports.logWithSpinner = (symbol, msg) => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('over')
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  }

  spinner.start()
}

exports.stopSpinner = (persist) => {
  if (!spinner.isSpinning) {
    return
  }

  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

