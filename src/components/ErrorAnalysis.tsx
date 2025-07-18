import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { RGBColor } from '../utils/color';

type Pixel = [number, number, number, number];

interface ErrorAnalysisProps {
  originalPixels: Pixel[];
  palette: RGBColor[];
  assignments: number[];
}

const AnalysisContainer = styled.div`
  padding-top: 20px;
`;

const Stat = styled.div`
  font-family: 'JetBrains Mono', monospace;
`;

const calculateMSE = (original: Pixel[], compressed: RGBColor[]): number => {
  if (original.length === 0 || original.length !== compressed.length) return 0;
  let mse = 0;
  for (let i = 0; i < original.length; i++) {
    mse += Math.pow(original[i][0] - compressed[i][0], 2);
    mse += Math.pow(original[i][1] - compressed[i][1], 2);
    mse += Math.pow(original[i][2] - compressed[i][2], 2);
  }
  return mse / (original.length * 3);
};

const calculatePSNR = (mse: number): number => {
  if (mse === 0) return Infinity;
  return 20 * Math.log10(255) - 10 * Math.log10(mse);
};

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ originalPixels, palette, assignments }) => {
  const { mse, psnr } = useMemo(() => {
    if (!originalPixels.length || !palette.length || !assignments.length) {
      return { mse: 0, psnr: 0 };
    }

    const compressedImage: RGBColor[] = assignments.map(index => palette[index]);
    const mseValue = calculateMSE(originalPixels, compressedImage);
    const psnrValue = calculatePSNR(mseValue);

    return { mse: mseValue, psnr: psnrValue };
  }, [originalPixels, palette, assignments]);

  return (
    <AnalysisContainer>
      <h4>误差分析</h4>
      <Stat>MSE: {mse.toFixed(2)}</Stat>
      <Stat>PSNR: {psnr.toFixed(2)} dB</Stat>
    </AnalysisContainer>
  );
};

export default ErrorAnalysis; 