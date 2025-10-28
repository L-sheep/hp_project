// src/App.tsx
import React, { useState, useMemo } from 'react';
import { Box, Button, Tabs, Tab, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


import TitleBar from './components/titleBar/titleBar';
import { useFileManager } from './managers/fileManager';
import { useSSHManager } from './managers/sshManager';

import { convertLogString } from '@/process/interrupts';

import { SimulatePanel } from '@/components/simulator/SimulatePanel';

import './App.css';

function App() {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [inputLog, setInputLog] = useState('');
  const [outputLog, setOutputLog] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const { status, connect, disconnect, execute } = useSSHManager();
  const [ip, setIp] = useState('');
  const rebootCommand = `source /data/python3/bin/activate && rostopic pub -1 /hwa/system std_msgs/String '{"data": "{\\"type\\":\\"reboot\\"}"}'`;


  const longTextLines = useMemo(() => {
    return Array.from({ length: 2000 }, (_, i) => `line ${i + 1}`).join('\n');
  }, []);

  return (
    <div className="app-container">
      {/* 自定义 TitleBar 固定在最上面 */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <TitleBar />
      </Box>
      {/* 侧边栏 + 内容区，需要下移 32px 给 TitleBar 留空间 */}
      <Box sx={{ flex: 1, display: 'flex', marginTop: '32px', width: '100%' }}>
        {/* 左侧 Tabs 栏 */}
        <Box className="sidebar">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
          >
            <Tab label="中台日志" />
            <Tab label="故障分析" />
            <Tab label="设置" />
          </Tabs>
        </Box>

        {/* 右侧内容区 */}
        <Box className="content">
          {selectedTab === 0 && (
            <>
              <Box
                className="panel"
                sx={{
                  p: 2,
                  overflow: 'auto',
                  whiteSpace: 'pre',
                  backgroundColor: '#fa8585', // 红色背景
                  flex: 0.5 // 占据50%宽度
                }}
              >
                {longTextLines}
              </Box>
              <Box
                className="panel"
                sx={{
                  p: 2,
                  overflow: 'auto',
                  whiteSpace: 'pre',
                  backgroundColor: '#f5f597', // 黄色背景
                  flex: 0.5 // 占据50%宽度
                }}
              >
                {longTextLines} {/* 或其他内容 */}
              </Box>
            </>
          )}

          {selectedTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              {/* 输入区域 */}
              <Box
                className="panel"
                sx={{
                  p: 2,
                  overflow: 'auto',
                  backgroundColor: '#fa8585',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <textarea
                  value={inputLog}
                  onChange={(e) => setInputLog(e.target.value)}
                  placeholder="粘贴原始日志..."
                  style={{
                    width: '100%',
                    height: '100%',
                    resize: 'none',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}
                />
              </Box>

              {/* 中间操作区域 */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  gap: 2,
                  minWidth: '160px'
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    setOutputLog(
                      convertLogString(
                        inputLog,
                        selectedLevel !== '' ? Number(selectedLevel) : undefined
                      )
                    )
                  }
                >
                  ➡️ 转换
                </Button>

                <FormControl size="small" sx={{ width: '160px' }}>
                  <InputLabel>筛选等级</InputLabel>
                  <Select
                    value={selectedLevel}
                    label="筛选等级"
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <MenuItem value="">不过滤</MenuItem>
                    <MenuItem value="1">普通信息-工作消息</MenuItem>
                    <MenuItem value="2">普通信息-特殊状态</MenuItem>
                    <MenuItem value="3">普通信息-故障</MenuItem>
                    <MenuItem value="4">普通信息-常驻</MenuItem>
                    <MenuItem value="5">常驻故障</MenuItem>
                    <MenuItem value="6">安规</MenuItem>
                  </Select>
                </FormControl>
              </Box>


              {/* 输出区域 */}
              <Box
                className="panel"
                sx={{
                  p: 2,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#f5f597',
                  flex: 1
                }}
              >
                {outputLog}
              </Box>
            </Box>
          )}

          {selectedTab === 2 && (
            <Box className="panel" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* SSH 功能按钮组 */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    mb: 1
                  }}
                >
                  SSH 连接管理
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <input type="text" name="username" placeholder="输入机器ip" onChange={(e) => setIp(e.target.value)} />
                  <Button variant="contained" color="primary" size="small" onClick={() => connect(ip)}>ssh 连接</Button>
                  <Button variant="contained" color="secondary" size="small" onClick={disconnect} >ssh 断开</Button>
                </Box>
              </Box>

              {/* 其他功能按钮组 */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    mb: 1
                  }}
                >
                  <SimulatePanel />

                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>


    </div>
  );
}

export default App;
