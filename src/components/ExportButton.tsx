import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { exportToPdf } from '../utils/pdf';

const ExportButtonStyled = styled(motion.button)`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;

  &:hover {
    background: #218838;
  }
`;

const ExportButton: React.FC = () => {
  const handleExport = () => {
    exportToPdf();
  };

  return (
    <ExportButtonStyled 
      onClick={handleExport}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      导出实验报告 (PDF)
    </ExportButtonStyled>
  );
};

export default ExportButton; 