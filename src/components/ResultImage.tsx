import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { RGBColor } from '../types';
import ImageComparator from './ImageComparator'; // Import our custom component

const ResultContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const CompareImageWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
  min-height: 200px; /* Prevent layout collapse while loading */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
`;

interface ResultImageProps {
  originalImageURL: string;
  palette: RGBColor[];
  assignments: number[];
  imageSize: { width: number, height: number };
}

const ResultImage: React.FC<ResultImageProps> = ({ originalImageURL, palette, assignments, imageSize }) => {

  const clusteredImageURL = useMemo(() => {
    if (!assignments.length || !palette.length || !imageSize.width) {
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    
    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < assignments.length; i++) {
      const color = palette[assignments[i]];
      if (color) {
        imageData.data[i * 4] = color.r;
        imageData.data[i * 4 + 1] = color.g;
        imageData.data[i * 4 + 2] = color.b;
        imageData.data[i * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }, [assignments, palette, imageSize]);

  if (!originalImageURL || !clusteredImageURL) {
    return null;
  }

  return (
    <ResultContainer>
      <h4>聚类后效果对比</h4>
      <p>拖动滑块进行对比</p>
      <CompareImageWrapper>
        <ImageComparator 
          leftImage={originalImageURL} 
          rightImage={clusteredImageURL}
        />
      </CompareImageWrapper>
    </ResultContainer>
  );
};

export default ResultImage; 