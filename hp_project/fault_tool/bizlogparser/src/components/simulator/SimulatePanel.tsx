/* src/components/simulator/SimulatePanel.tsx */
import React, { useState } from 'react';
import { Box } from '@mui/material';

import ProductTabs from './ProductTabs';
import CommandExecutor from './CommandExecutor';
import './simulator.css';

import G2405 from './products/G2405';
import G2529 from './products/G2529';
import G2538 from './products/G2538';

const productMap = {
  G2405,
  G2538,
  G2529
};

export const SimulatePanel = () => {
  const [productKey, setProductKey] = useState<keyof typeof productMap>('G2405');
  const commands = productMap[productKey];

  return (
    <Box className="panelContainer">
      <ProductTabs
        products={Object.keys(productMap)}
        selected={productKey}
        onChange={(k) => setProductKey(k as keyof typeof productMap)}
      />
      <CommandExecutor commands={commands} />
    </Box>
  );
};
