// src/components/simulator/CommandExecutor.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { SimulationCommand } from './types';
import { useSSHManager } from '@/managers/sshManager';

type Props = {
  commands: SimulationCommand[]; // 当前产品的所有模拟命令
};

const CommandExecutor = ({ commands }: Props) => {
  const [selectedIdx, setSelectedIdx] = useState<number | ''>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false); // 新增loading状态
  const { executeBlueMsg } = useSSHManager();

  const cmd = typeof selectedIdx === 'number' ? commands[selectedIdx] : null;

  useEffect(() => {
    setSelectedIdx('');
    setStatus('idle');
    setLoading(false);
  }, [commands]);

  const run = async () => {
    if (!cmd) return;
    setLoading(true); // 点击后禁用按钮
    setStatus('idle');
    try {
      await executeBlueMsg(cmd.index, cmd.name, true);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false); // 成功或失败后恢复
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>模拟项</InputLabel>
        <Select
          value={selectedIdx}
          onChange={(e) => {
            setSelectedIdx(Number(e.target.value));
            setStatus('idle');
          }}
          label="模拟项"
        >
          {commands.map(({ name, index }, i) => (
            <MenuItem key={i} value={i}>
              [{index}] {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={run}
        disabled={selectedIdx === '' || loading}
      >
        {loading ? '执行中...' : '执行'}
      </Button>

      {status === 'idle' && <HourglassEmptyIcon color="disabled" />}
      {status === 'success' && <CheckIcon color="success" />}
      {status === 'error' && <CloseIcon color="error" />}
    </Box>
  );
};

export default CommandExecutor;
