// src/control/logControlManager.ts

import { useFileManager } from '@/managers/fileManager';
import { useLogManager, LogFileMeta } from '@/managers/logManager';
import { useState } from 'react';

export function useLogControlManager() {
  const fileManager = useFileManager();
  const logManager = useLogManager();

  const [bizLogs, setBizLogs] = useState<LogFileMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 调用 fileManager 解压文件后，再读取中台日志
   */
  async function handleFileAndReadBizLogs(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    setError(null);
    setBizLogs([]);

    try {
        // // 读取biz log列表
        // const result = await fileManager.handleFileSelection(event); // 直接拿返回值
        // if (!result) throw new Error('未选择有效文件');
        // const { targetDir } = result;
        // const logList = await logManager.readBizLogList(targetDir);
        // setBizLogs(logList.logs);
        // console.log("list = ", logList.logs, " current = " , logList.current);

        // // 读取current log
            const result = await fileManager.handleFileSelection(event);
            if (!result) throw new Error('未选择有效文件');
        
            const { targetDir } = result;
            // 获取日志列表 + 当前 current
            const logList = await logManager.readBizLogList(targetDir);
            const { logs, current } = logList;
            setBizLogs(logs);

            console.log("logs =", logs, "current =", current);

            // 获取 current 对应 log.N 路径
            const currentLog = logs.find(log => log.index === current);
            if (!currentLog) {
            console.warn(`⚠️ 没有找到 index=${current} 对应的 log 文件`);
            return;
            }

            // // 读取当前 log 内容
            // const contentResult = await fs.readFileContent(currentLog.path);
            // if (!contentResult.success || !contentResult.data) {
            // throw new Error(`读取当前日志失败: ${contentResult.message}`);
            // }

            // console.log(`📄 当前日志 log.${current} 内容：\n`, contentResult.data);

    } catch (err: any) {
      console.error('❌ 操作失败:', err);
      setError(err.message || '未知错误');
    } finally {
      setLoading(false);
    }
  }

  return {
    openFileSelector: fileManager.openFileSelector,
    fileInputRef: fileManager.fileInputRef,
    handleFileAndReadBizLogs,
    bizLogs,
    loading,
    error
  };
}
