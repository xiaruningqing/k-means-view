import React from 'react';
import styled from 'styled-components';
import type { RGBColor } from '../utils/color';

const TimelineContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
  border-top: 1px solid #444;
`;

const TimelineTrack = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const TimelineItem = styled.div`
  cursor: pointer;
  border: 2px solid transparent;
  padding: 4px;
  border-radius: 8px;
  
  &:hover {
    border-color: #4a90e2;
  }
`;

const PaletteSnapshot = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
`;

const ColorSquare = styled.div<{ color: string }>`
  width: 100%;
  padding-bottom: 100%; /* Maintain aspect ratio 1:1 */
  background-color: ${props => props.color};
`;

interface TimelineProps {
  history: RGBColor[][];
  onSelect: (index: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ history, onSelect }) => {
  return (
    <TimelineContainer>
      <h4>调色板演变</h4>
      <TimelineTrack>
        {history.map((palette, index) => (
          <TimelineItem key={index} onClick={() => onSelect(index)}>
            <PaletteSnapshot>
              {palette.slice(0, 4).map((color, cIndex) => (
                <ColorSquare key={cIndex} color={`rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`} />
              ))}
            </PaletteSnapshot>
          </TimelineItem>
        ))}
      </TimelineTrack>
    </TimelineContainer>
  );
};

export default Timeline; 