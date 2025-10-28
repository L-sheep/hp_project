// src/managers/logManager.ts

import * as fs from '../services/fsService';
import * as regex from '../services/regexService';

export interface LogFileMeta {
  index: number; // log index
  lastModified: number; // 最后修改时间
  size: number; // 文件大小
  path: string; // 路径
}

export interface LogList {
  current: number | null;
  logs: LogFileMeta[];
}

export interface LogManagerHook {
  readBizLogList(rootPath: string): Promise<LogList>;
  readMapFile(path: string): Promise<void>;
  readConfigFile(path: string): Promise<void>;
  readIotLogs(path: string): Promise<void>;
}

export function useLogManager(): LogManagerHook {
  /**
   * 读取中台日志列表
   * @param rootPath 解压后文件所在根目录
   * @returns 日志文件元信息列表
   */
  async function readBizLogList(rootPath: string): Promise<LogList> {
    const bizLogDir = `${rootPath}\\data\\log\\biz`; // 构造中台日志路径
    const listResult = await fs.readDirRecursive(bizLogDir);

    if (!listResult.success || !listResult.data) {
      throw new Error(`中台日志目录读取失败: ${listResult.message}`);
    }

    const logFileRegex = /^log\.(\d+)$/;

    const logs: LogFileMeta[] = listResult.data
      .filter(file => logFileRegex.test(file.name))
      .map(file => {
        const match = file.name.match(logFileRegex);
        return {
          index: match ? parseInt(match[1], 10) : -1,
          lastModified: file.mtimeMs,
          size: file.size,
          path: file.path
        };
      })
      .sort((a, b) => a.index - b.index); // 按 index 升序
   
    const current = await readCurrentIndex(bizLogDir);  
    return { current, logs };
  }

  /**
   * 读取地图文件（占位）
   */
  async function readMapFile(path: string): Promise<void> {
    console.log(`[LogManager] 读取地图文件 => ${path}`);
    // TODO: 实现地图读取逻辑
  }

  /**
   * 读取配置文件（占位）
   */
  async function readConfigFile(path: string): Promise<void> {
    console.log(`[LogManager] 读取配置文件 => ${path}`);
    // TODO: 实现配置解析逻辑
  }

  /**
   * 读取 IoT 日志（占位）
   */
  async function readIotLogs(path: string): Promise<void> {
    console.log(`[LogManager] 读取IoT日志 => ${path}`);
    // TODO: 实现IoT日志解析逻辑
  }

  /**
   * 解析Current
   */
  async function readCurrentIndex(dir: string): Promise<number | null> {
    const currentPath = `${dir}\\current`;
    const result = await fs.readFileContent(currentPath);
    if (!result.success || !result.data) {
      console.warn(`读取 current 文件失败: ${result.message}`);
      return null;
    }
  
    const content = result.data.trim();
    const currentIndex = parseInt(content, 10);
  
    return isNaN(currentIndex) ? null : currentIndex;
  }

  return {
    readBizLogList,
    readMapFile,
    readConfigFile,
    readIotLogs
  };
}
