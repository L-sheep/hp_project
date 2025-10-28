/// <reference types="vite/client" />

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import('electron').IpcRenderer
  cmd: {
    sshConnect: (host: string, username: string, password: string) => Promise<string>;
    executeCommand: (command: string) => Promise<string>;
    sshDisconnect: () => Promise<string>;
  };
  fs: {
    unpackTarToDest: (buffer: Uint8Array, destPath: string) => Promise<{ success: boolean; message?: string }>;
    readDirRecursive: (dirPath: string) => Promise<{ success: boolean; data?: FileEntry[]; message?: string }>;
    readFileContent: (filePath: string) => Promise<{ success: boolean; data?: string; message?: string }>;
  };
  regex: {
    filterStateFlow: (content: string) => Promise<{ success: boolean; data?: string; message?: string }>;
  };
}