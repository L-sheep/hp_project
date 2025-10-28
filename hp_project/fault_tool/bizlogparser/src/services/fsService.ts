
// src/services/fsService.ts
/**
 * @description 文件系统相关服务（解压、读目录、读文件）
 */

/**
 * 解压 tar 包
 * @param buffer 二进制数据
 * @param dest 目标路径
 */
export async function unpack(buffer: Uint8Array, dest: string) {
  console.log(`[FS] 解压到: ${dest}, 大小 ${buffer.byteLength} 字节`);
  const res = await window.fs.unpackTarToDest(buffer, dest);
  console.log(`[FS] 解压结果: ${res.success ? '成功' : '失败'}${res.message ? ',' + res.message : ''}`);
  return res;
}

/** 递归读取目录下所有文件 */
export async function readDirRecursive(path: string) {
  console.log(`[FS] 读取目录: ${path}`);
  const res = await window.fs.readDirRecursive(path);
  console.log(`[FS] 目录读取: ${res.success ? '成功' : '失败'}${res.message ? ',' + res.message : ''}`);
  return res;
}

/**
 * 读取文件内容
 * @param path 文件完整路径
 */
export async function readFileContent(path: string) {
  console.log(`[FS] 读取文件内容: ${path}`);
  const res = await window.fs.readFileContent(path);
  console.log(`[FS] 读取结果: ${res.success ? '成功' : '失败'}${res.message ? ',' + res.message : ''}`);
  return res;
}
