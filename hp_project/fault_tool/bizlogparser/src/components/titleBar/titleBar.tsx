// src/components/titleBar/TitleBar.tsx
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import CloseIcon from '@mui/icons-material/Close';
import { useLogControlManager } from '@/control/logControlManager';

import './titleBar.css';

// 声明 preload 暴露的 API
declare global {
  interface Window {
    electronAPI: {
      minimize:    () => void;
      maximize:    () => void;
      unmaximize:  () => void;
      close:       () => void;
      onMaximize:   (cb: () => void) => void;
      onUnmaximize: (cb: () => void) => void;
      isMaximized:  () => Promise<boolean>;
      // 如果你 preload 里暴露了 showAbout 也可以声明：
      // showAbout?: () => void;
    };
  }
}

export default function TitleBar() {
    const [isMax, setIsMax] = useState(false);
    // const { openFileSelector, fileInputRef, handleFileSelection } = useFileManager();
    const {
      openFileSelector,
      fileInputRef,
      handleFileAndReadBizLogs,
      bizLogs,
      loading,
      error
    } = useLogControlManager();
  
    useEffect(() => {
      window.electronAPI.isMaximized().then(setIsMax);
      window.electronAPI.onMaximize(() => setIsMax(true));
      window.electronAPI.onUnmaximize(() => setIsMax(false));
    }, []);

  const handleAbout = () => {
    // 如果你在 preload.js 里做了 showAbout，可以调用它：
    // window.electronAPI.showAbout?.();
    // 否则简单弹个对话框
    alert('版本 1.0.0');
  };

  return (
    <AppBar position="static" elevation={0} className="titleBar" sx={{ height: 32, minHeight: 32 }}>
      <Toolbar variant="dense" className="titleBar" sx={{ height: 32, minHeight: 32, px: 1, display: 'flex', gap: 1 }}>
        <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
          MyElectronApp
        </Typography>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileAndReadBizLogs}
        />

        <Button
          variant="text"
          size="small"
          onClick={openFileSelector}
          className="titleBarButton"
        >
          打开文件
        </Button>

        <Button
          variant="text"
          size="small"
          onClick={handleAbout}
          className="titleBarButton"
        >
          关于
        </Button>

        <IconButton size="small" onClick={() => window.electronAPI.minimize()} className="titleBarButton">
          <MinimizeIcon fontSize="inherit" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() =>
            isMax ? window.electronAPI.unmaximize() : window.electronAPI.maximize()
          }
          className="titleBarButton"
        >
          {isMax ? <FilterNoneIcon fontSize="inherit" /> : <CropSquareIcon fontSize="inherit" />}
        </IconButton>

        <IconButton size="small" onClick={() => window.electronAPI.close()} className="titleBarButton">
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}