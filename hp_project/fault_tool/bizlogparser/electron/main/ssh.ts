// electron/main/ssh.ts
import { Client } from 'ssh2';

// 声明一个可选的客户端对象，用于保存SSH连接
let sshClient: Client | null = null;

/**
 * 建立 SSH 连接
 * @param host IP 地址
 * @param username 用户名
 * @param password 密码
 * @returns 成功信息或错误信息
 */
export const sshConnect = (host: string, username: string, password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (sshClient) {
      reject('Already connected');
      return;
    }

    sshClient = new Client();
    sshClient
      .on('ready', () => {
        resolve('Connected successfully');
      })
      .on('error', (err) => {
        reject(`Connection error: ${err.message}`);
      })
      .connect({
        host,
        port: 22,
        username,
        password,
        readyTimeout: 20000,        // 增加连接准备时间
        keepaliveInterval: 10000,   // 保持连接活动
      });
  });
};

/**
 * 执行 SSH 命令（通过 shell 模拟真实登录会话）
 * 适用于 BusyBox、Athena Linux 等需要登录上下文的环境。
 * @param command 多行复合 Shell 命令字符串
 * @returns 命令输出（标准输出 + 错误输出）
 */
export const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!sshClient) {
      reject('SSH client is not connected');
      return;
    }

    sshClient.shell((err, stream) => {
      if (err) {
        reject(`Failed to open shell: ${err.message}`);
        return;
      }

      let result = '';

      stream
        .on('data', (data: Buffer) => {
          result += data.toString();
        })
        .stderr.on('data', (data: Buffer) => {
          result += '\n[stderr] ' + data.toString();
        })
        .on('close', () => {
          resolve(result.trim());
        });

      // 发送命令并安全退出 shell 会话
      stream.write(`${command}\nexit\n`);
    });
  });
};

/**
 * 断开 SSH 连接
 * @returns 操作结果字符串
 */
export const sshDisconnect = (): string => {
  if (sshClient) {
    sshClient.end();
    sshClient = null;
    return 'Disconnected successfully';
  } else {
    return 'No active connection to disconnect';
  }
};
