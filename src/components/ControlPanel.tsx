import React from 'react';
import styled from 'styled-components';

interface ControlPanelProps {
  k: number;
  onKChange: (k: number) => void;
  maxIterations: number;
  onMaxIterationsChange: (iterations: number) => void;
  onStart: () => void;
  onReset: () => void;
  isClustering: boolean;
  progress: number;
  iteration: number;
  mse: number;
  psnr: number;
  pixelCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  k,
  onKChange,
  maxIterations,
  onMaxIterationsChange,
  onStart,
  onReset,
  isClustering,
  progress,
  iteration,
  mse,
  psnr,
  pixelCount
}) => {
  return (
    <PanelContainer>
      <Title>控制面板</Title>
      
      <ControlGroup>
        <Label>聚类数量 (K): {k}</Label>
        <Slider 
          type="range" 
          min="2" 
          max="64" 
          value={k} 
          onChange={(e) => onKChange(Number(e.target.value))}
          disabled={isClustering}
        />
      </ControlGroup>

      <ControlGroup>
        <Label>最大迭代次数: {maxIterations}</Label>
        <Slider 
          type="range" 
          min="1" 
          max="100" 
          value={maxIterations} 
          onChange={(e) => onMaxIterationsChange(Number(e.target.value))}
          disabled={isClustering}
        />
      </ControlGroup>

      <ButtonGroup>
        <Button onClick={onStart} disabled={isClustering || pixelCount === 0}>
          {isClustering ? `处理中...(${(progress * 100).toFixed(0)}%)` : '开始聚类'}
        </Button>
        <Button onClick={onReset} disabled={isClustering}>
          重置
        </Button>
      </ButtonGroup>

      { (isClustering || mse > 0) &&
        <StatsContainer>
          <Stat>迭代: {iteration}</Stat>
          <Stat>处理像素: {pixelCount.toLocaleString()}</Stat>
          { mse > 0 && <Stat>MSE: {mse.toFixed(4)}</Stat> }
          { psnr > 0 && <Stat>PSNR: {psnr.toFixed(2)} dB</Stat> }
        </StatsContainer>
      }
    </PanelContainer>
  );
};

export default ControlPanel;

const PanelContainer = styled.div`
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #f0f0f0;
`;

const Title = styled.h2`
  text-align: center;
  margin-top: 0;
  color: #61dafb;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
`;

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #555;
  border-radius: 5px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #61dafb;
    cursor: pointer;
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #61dafb;
    cursor: pointer;
    border-radius: 50%;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.button`
  flex-grow: 1;
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #61dafb;
  color: #1a1a1a;
  transition: background-color 0.3s, transform 0.2s;

  &:disabled {
    background-color: #4a5a60;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #88e1fc;
    transform: translateY(-2px);
  }
`;

const StatsContainer = styled.div`
  background-color: #333;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
`;

const Stat = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
`; 