/**
 * @description 常见文件读写场景
 *
 */
const fs = require('fs-extra')
const path = require('path')

// 对比删除文件
exports.deleteRemovedFiles = (dir, files, previousFiles) => {
  const filesToDelete = Object.keys(previousFiles).filter(file => !files[file])
  // 并发删除
  return Promise.all(filesToDelete.map(fileName => {
    return fs.unlink(path.join(dir, fileName))
  }))
}


// 再具体目录下写入文件
exports.writeFileTree = async function (dir, files, previousFiles, include) {
  // 有历史文件先删除
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }
  // 用 forEach 跳出当前循环
  Object.keys(files).forEach(name => {
    const filePath = path.join(dir, name)

    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })
}
