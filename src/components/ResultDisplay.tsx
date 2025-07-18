import React, { useMemo } from 'react';
import styled from 'styled-components';

const distanceSq = (p1: number[], p2: number[]) => {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2;
};

interface ResultDisplayProps {
  centroids: number[][];
  originalImageURL: string | null;
  fullImageData: ImageData | null;
  imageSize: { width: number; height: number };
  isClustering: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  centroids,
  originalImageURL,
  fullImageData,
  imageSize,
  isClustering,
}) => {
  const compressedImageDataUrl = useMemo(() => {
    if (isClustering || centroids.length === 0 || !fullImageData) {
      return null;
    }

    const { width, height } = imageSize;
    if (width === 0 || height === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const newImageData = ctx.createImageData(width, height);
    const originalData = fullImageData.data;
    const newData = newImageData.data;
    const assignmentsMap = new Int32Array(width * height);

    // Pass 1: Assign each pixel to a centroid and color it
    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4;
      const pixel = [originalData[pixelIndex], originalData[pixelIndex + 1], originalData[pixelIndex + 2]];
      
      let minDistance = Infinity;
      let assignedIndex = 0;
      for (let c = 0; c < centroids.length; c++) {
        const dist = distanceSq(pixel, centroids[c]);
        if (dist < minDistance) {
          minDistance = dist;
          assignedIndex = c;
        }
      }
      assignmentsMap[i] = assignedIndex;
      
      const closestCentroid = centroids[assignedIndex];
      newData[pixelIndex] = Math.round(closestCentroid[0]);
      newData[pixelIndex + 1] = Math.round(closestCentroid[1]);
      newData[pixelIndex + 2] = Math.round(closestCentroid[2]);
      newData[pixelIndex + 3] = 255;
    }

    // Pass 2: Draw highlighted borders between clusters
    for (let y = 0; y < height - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const currentIndex = y * width + x;
        const rightIndex = y * width + (x + 1);
        const downIndex = (y + 1) * width + x;
        
        if (assignmentsMap[currentIndex] !== assignmentsMap[rightIndex] || assignmentsMap[currentIndex] !== assignmentsMap[downIndex]) {
          const pixelIndex = currentIndex * 4;
          newData[pixelIndex] = 255;     // Highlight color: Yellow
          newData[pixelIndex + 1] = 255;
          newData[pixelIndex + 2] = 0;
        }
      }
    }

    ctx.putImageData(newImageData, 0, 0);
    return canvas.toDataURL();
  }, [centroids, fullImageData, imageSize, isClustering]);

  if (isClustering || !originalImageURL) {
    return null;
  }

  return (
    <Overlay>
      <Container>
        <Header>原图 vs. 压缩结果</Header>
        <ImageCompare>
          <ImageWrapper>
            {originalImageURL && <img src={originalImageURL} alt="Original" />}
            <Label>原图</Label>
          </ImageWrapper>
          <ImageWrapper>
            {compressedImageDataUrl && <img src={compressedImageDataUrl} alt="Compressed" />}
            <Label>压缩后</Label>
          </ImageWrapper>
        </ImageCompare>
        <PaletteContainer>
          <PaletteHeader>最终调色板</PaletteHeader>
          <ColorGrid>
            {centroids.map((color, index) => (
              <ColorBox key={index} color={`rgb(${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])})`} />
            ))}
          </ColorGrid>
        </PaletteContainer>
      </Container>
    </Overlay>
  );
};

export default ResultDisplay;

const Overlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  z-index: 1000;
  width: 380px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Header = styled.h3`
  text-align: center;
  margin: 0;
  color: #00aaff;
  font-weight: 600;
`;

const ImageCompare = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 15px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #444;
  }
`;

const Label = styled.span`
  font-size: 0.9em;
  color: #aaa;
`;

const PaletteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaletteHeader = styled.h4`
  margin: 0;
  text-align: center;
  font-size: 1em;
  color: #ccc;
  font-weight: 500;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 10px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 100%;
  padding-bottom: 100%; /* Aspect ratio 1:1 */
  background-color: ${(props) => props.color};
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`; 