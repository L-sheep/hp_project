// src/managers/fileManager.ts

import {useState, useRef, RefObject} from 'react';
import * as fsService from '../services/fsService';
import * as regexService from '../services/regexService';

export type ProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export interface UnpackedFileInfo {
  file: File;
  targetDir: string;
}

/**
 * Hook 返回值类型
 */
export interface FileManagerHook {
  /** 当前选中的文件 */
  file: File | null;
  /** 当前处理状态 */
  status: ProcessStatus;
  /** 错误信息（若有） */
  error: string | null;
  /** 读取文件内容 */
  readFileContent(path: string): Promise<string>;
  /** 文件输入框的 Ref */
  fileInputRef: RefObject<HTMLInputElement>;
  /** 打开文件选择器 */
  openFileSelector(): void;
  /** 处理用户选择文件事件 */
  handleFileSelection(event: React.ChangeEvent<HTMLInputElement>): Promise<UnpackedFileInfo | null>;
}

/**
 * 处理文件选择、解压、遍历和过滤的 Hook
 * @returns FileManagerHook
 */
export function useFileManager(): FileManagerHook {
  // 默认解压目录
  const DEFAULT_DIR = 'F:\\test\\dst';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 打开隐藏的文件选择器
   */
  function openFileSelector(): void {
    fileInputRef.current?.click();
  }

  /**
   * 处理文件选择事件
   * @param event 文件输入框的 change 事件
   */
  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>): Promise<UnpackedFileInfo | null> {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (!selectedFile) return null;

    const fullName = selectedFile.name;
    console.info('已选择文件:', fullName);
    try {
      const buffer = await selectedFile.arrayBuffer();

      if (buffer.byteLength === 0) {
        throw new Error('文件内容为空，无法解压');
      }

      const targetDir = DEFAULT_DIR + "\\" + fullName;
      await decompressFile(new Uint8Array(buffer), targetDir);
      console.log('📦 解压成功，输出目录:', targetDir);
      alert('✅ 解压成功');
      setStatus('success');
      return { file:selectedFile, targetDir:targetDir };
    } catch (err: any) {
      console.error('❌ 文件处理失败:', err);
      setError(err.message || '未知错误');
      setStatus('error');
      return null;
    }
  }

  /**
   * 解压文件到指定目录
   * @param buffer 文件二进制数据
   * @throws 解压失败时抛出错误
   */
  async function decompressFile(buffer: Uint8Array, outputDir: string): Promise<void> {
    const result = await fsService.unpack(buffer, outputDir);
    if (!result.success) {
      throw new Error(`解压失败: ${result.message}`);
    }
  }

  /**
   * 遍历目录所有文件路径
   * @param dir 待遍历的目录路径
   * @returns 文件路径数组
   * @throws 遍历失败时抛出错误
   */
  async function listAllFilePaths(dir: string): Promise<string[]> {
    const listResult = await fsService.readDirRecursive(dir);
    if (!listResult.success || !listResult.data) {
      throw new Error(`遍历目录失败: ${listResult.message}`);
    }
    return listResult.data.map(fileInfo => fileInfo.path);
  }


  // 读取文件内容
  async function readFileContent(path: string): Promise<string> {
    const result = await fsService.readFileContent(path);
    if (!result.success || !result.data) {
      throw new Error(`读取文件失败: ${result.message}`);
    }
    return result.data;
  }

  return {
    file,
    status,
    error,
    readFileContent,
    fileInputRef,
    openFileSelector,
    handleFileSelection,
  };
}
