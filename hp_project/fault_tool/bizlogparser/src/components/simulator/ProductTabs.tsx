/* src/components/simulator/ProductTabs.tsx */
import React from 'react';
import { Tabs, Tab } from '@mui/material';

type Props = {
  products: string[];
  selected: string;
  onChange: (product: string) => void;
};

const ProductTabs = ({ products, selected, onChange }: Props) => (
  <Tabs value={selected} onChange={(_, newVal) => onChange(newVal)}>
    {products.map((name) => (
      <Tab key={name} label={name} value={name} />
    ))}
  </Tabs>
);

export default ProductTabs;
