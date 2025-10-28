import React, { useState } from 'react';
import { FixedSizeList as List } from 'react-window';  // 引入 react-window 的虚拟列表
import { Box, Typography } from '@mui/material';  // 使用 MUI 和 Umi 组件
import classNames from 'classnames';
import './logViewer.css';

interface LogViewerProps {
  logs: string[]; // 每行日志
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isFailedLine = (line: string) => /failed/i.test(line); // 判断是否包含 'failed'

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const line = logs[index];
    const isSelected = selectedIndex === index;
    const isFailed = isFailedLine(line);

    return (
      <div
        style={style}
        key={index}
        onClick={() => setSelectedIndex(index)} // 点击选中
        className={classNames('log-line', {
          'log-selected': isSelected,  // 高亮选中行
          'log-failed': isFailed,      // 高亮含 'failed' 行
        })}
      >
        <Box
          sx={{
            padding: '10px 15px',
            margin: '5px 0',
            borderRadius: '5px',
            backgroundColor: isSelected ? 'rgba(0, 123, 255, 0.1)' : isFailed ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
            cursor: 'pointer',
          }}
        >
          <Typography variant="body1">{line}</Typography> {/* 使用 Typography 来显示文本 */}
        </Box>
      </div>
    );
  };

  return (
    <List
      height={500}  // 设置虚拟列表的高度
      width="100%"  // 宽度填充父容器
      itemSize={35} // 每项的高度
      itemCount={logs.length} // 数据项数量
      overscanCount={10} // 提前渲染的项数
    >
      {renderRow}
    </List>
  );
};

export default LogViewer;
