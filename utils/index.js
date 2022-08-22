exports.chalk = require('chalk')
exports.execa = require('execa')
exports.semver = require('semver')

// commonjs 多模块集中导出
const exportArr = ['logger', 'spinner', 'env', 'file'] || []
exportArr.forEach(m => {
  Object.assign(exports, require(`./${m}`))
})
