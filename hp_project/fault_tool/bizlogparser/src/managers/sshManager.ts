// src/managers/sshManager.ts
import { useState } from 'react';
import * as sshService from '../services/sshService';
import { Alert } from '@mui/material';

/** Hook managing SSH connection state and actions. */
export function useSSHManager() {
  const [status, setStatus] = useState<string>('');

  /** Initiates SSH connection. */
  async function connect(ip: string): Promise<void> {
    try {
      const result = await sshService.connectSSH(
        ip,
        'root',
        '#share!#'
      );
      setStatus(result);

       // 判断连接是否成功（根据实际返回的result内容调整判断条件）
      // 假设连接成功时result包含"success"或"connected"等标识
      if (result.toLowerCase().includes('success') || result.toLowerCase().includes('connected')) {
        // 最简单的alert弹窗提示连接成功
        alert('SSH连接成功！');
      }
      
      // 根据连接结果result 如果连接成哥 使用最简单的alert弹窗提示连接

    } catch (err) {
      const message = (err as Error).message;
      console.error('useSSHManager: connection error', message);
      setStatus(`Connection failed: ${message}`);
    }
  }

  /** Terminates SSH connection. */
  async function disconnect(): Promise<void> {
    try {
      const result = await sshService.disconnectSSH();
      setStatus(result);
    } catch (err) {
      const message = (err as Error).message;
      console.error('useSSHManager: disconnection error', message);
      setStatus(`Disconnection failed: ${message}`);
    }
  }

  /**
   * Executes a command over SSH.
   * @param command Command string to execute.
   * @returns Command output.
   */
  async function execute(command: string): Promise<string> {
    try {
      const result =  await sshService.execCommand(command);
      return result;
    } catch (err) {
      const message = (err as Error).message;
      console.error('useSSHManager: execution error', message);
      throw err;
    }
  }


  let token = 1;

  /**
   * 发送调试命令至蓝牙模块
   * @param index 故障项的索引号（对应 "d" 中的第一个值）
   * @param name 命令名，仅用于日志或未来扩展
   * @param enabled 是否启用（会转换为 1 或 0），默认 true（即发送值 1）
   * @returns SSH 执行返回的字符串结果
   */
  async function executeBlueMsg(index: number,name: string, enabled: boolean = true): Promise<string> {
    // 构造 JSON 字符串
    const payload = {
      q: token++,
      m: 's',
      t: 'DEBUG_INTERRUPT',
      d: [index, enabled ? 1 : 0]
    };
    const jsonStr = JSON.stringify(payload);
  
    // 转换为 ASCII 数组
    const asciiArray = Array.from(jsonStr).map((c) => c.charCodeAt(0)).join(',');
  
    // 构建 rostopic 命令
    const rosCmd = `rostopic pub /ble/cmd std_msgs/UInt8MultiArray "{data:[${asciiArray}]}" -1`;
    const fullCmd = `source /data/python3/bin/activate && ${rosCmd}`;
  
    // 执行命令
    return await execute(fullCmd);
  }
  

  return { status, connect, disconnect, execute, executeBlueMsg };
}
