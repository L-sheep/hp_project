// electron/main/unpack.ts

import fsExtra from 'fs-extra';
import * as tar from 'tar';
import * as os from 'os';
import * as path from 'path';

const fs = fsExtra as typeof import('fs-extra');  // 明确告诉 TS 是什么类型

/**
 * 解压 .tar 或 .tar.gz 的二进制内容到指定目录
 * @param buffer Uint8Array - 文件数据
 * @param destPath string - 解压目标路径
 */
export async function unpackTarFromBuffer(buffer: Uint8Array, destPath: string): Promise<void> {
    const tempTar = path.join(os.tmpdir(), `upload-${Date.now()}.tar.gz`);

    try {
        // 临时文件写入
        await fs.writeFile(tempTar, Buffer.from(buffer));
        // 创建目标目录
        await fs.ensureDir(destPath);
        // 解压
        await tar.extract({ file: tempTar, cwd: destPath });
    } catch (error: any) {
        throw new Error(`解压失败: ${error.message}`);
    } finally {
        // 确保临时文件被删除
        await fs.remove(tempTar);
    }
}

/**
 * 读取指定目录下所有文件的路径信息（不递归子目录）
 * @param dirPath 根目录
 * @returns 所有文件信息数组
 */
export async function readDirRecursive(dirPath: string): Promise<FileEntry[]> {
    const result: FileEntry[] = [];

    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        // 只处理文件，跳过子目录
        if (entry.isFile()) {
            result.push({
                name: entry.name,
                path: fullPath,
                relativePath: path.relative(dirPath, fullPath),
                ext: path.extname(entry.name),
            });
        }
    }

    return result;
}

/**
 * 读取指定文件的内容
 * @param filePath 文件路径
 * @returns 文件内容
 */
export async function readFileContent(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
}

/**
 * 文件信息结构
 */
export interface FileEntry {
    name: string;        // 文件名
    path: string;        // 文件路径
    relativePath: string; // 相对路径
    ext?: string;        // 文件扩展名
}
