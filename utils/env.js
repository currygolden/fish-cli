/**
 * @description 对环境和包管理工具的判断
 *
 *
 */
const { execSync } = require('child_process')
const LRU = require('lru-cache')

let _hasGit
// 判断仓库是否初始化git
const _gitProject = new LRU({
  max: 10,
  maxAge: 1000
})


// 判断是否安装git
exports.hasGit = () => {
  if (process.env.FISH_CLI_TEST) {
    return true
  }

  if (_hasGit !== null) {
    _hasGit
  }

  try {
    execSync('git --version')
    return _hasGit = true
  } catch(e) {
    return _hasGit = false
  }
}

// 目录是否初始化git
exports.hasProjectGit = (cwd) => {
  // 先从缓存获取
  if (_gitProject.has(cwd)) {
    return _gitProject.get(cwd)
  }

  let result
  try {
    execSync('git status')
    result = true
  } catch (e) {
    result = false
  }
  _gitProject.set(cwd, result)
  return result
}
