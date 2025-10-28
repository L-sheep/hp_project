// src/services/sshServices.ts
/**
 * SSH 连接
 * @returns 执行结果
 */
export async function connectSSH(host: string, user: string, pass: string) {
  console.log(`[SSH] 正在连接 ${user}@${host}`);
  const res = await window.cmd.sshConnect(host, user, pass);
  console.log(`[SSH] 连接返回: ${res}`);
  return res;
}

/**
 * 断开 SSH 连接
 * @returns 执行结果
 */
export async function disconnectSSH() {
  console.log('[SSH] 正在断开连接');
  const res = await window.cmd.sshDisconnect();
  console.log(`[SSH] 断开返回: ${res}`);
  return res;
}

/**
 * 执行远程命令
 * @param cmd 要执行的命令
 * @returns 命令执行结果
 */
export async function execCommand(cmd: string) {
  console.log(`[SSH] 执行命令: ${cmd}`);
  const output = await window.cmd.executeCommand(cmd);
  console.log(`[SSH] 命令输出: ${output}`);
  return output;
}
