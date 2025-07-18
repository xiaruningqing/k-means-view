import { useState, useCallback } from 'react';
import styled from 'styled-components';
import Scene3D from '../components/Scene3D';
import ControlPanel from '../components/ControlPanel';
import { useKMeans } from '../hooks/useKMeans';
import ResultDisplay from '../components/ResultDisplay';
import ImageUploader from '../components/ImageUploader';

const formatCentroidsForDisplay = (flatCentroids: number[]): number[][] => {
  const nestedCentroids: number[][] = [];
  for (let i = 0; i < flatCentroids.length; i += 3) {
    nestedCentroids.push([flatCentroids[i], flatCentroids[i + 1], flatCentroids[i + 2]]);
  }
  return nestedCentroids;
};

const KMeansVisualizationPage = () => {
  const [k, setK] = useState(16);
  const [maxIterations, setMaxIterations] = useState(20);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalImageURL, setOriginalImageURL] = useState<string | null>(null);
  const [fullImageData, setFullImageData] = useState<ImageData | null>(null);

  const {
    result,
    pixelColors,
    setPixelColors,
    centroids,
    isClustering,
    startKMeans,
    resetKMeans,
    extractPixels
  } = useKMeans();

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      const imageUrl = e.target?.result as string;
      setOriginalImageURL(imageUrl);
      img.src = imageUrl;
      img.onload = () => {
        setOriginalImage(img);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          setFullImageData(imageData);
          const pixels = extractPixels(imageData);
          setPixelColors(pixels);
        }
      };
    };
    reader.readAsDataURL(file);
  }, [extractPixels, setPixelColors]);

  const handleStart = useCallback(() => {
    startKMeans(k, maxIterations);
  }, [startKMeans, k, maxIterations]);
  
  const handleReset = useCallback(() => {
    resetKMeans();
    setOriginalImage(null);
    setOriginalImageURL(null);
    setFullImageData(null);
  }, [resetKMeans]);

  const finalCentroids = result?.centroids ?? [];

  return (
    <Container>
      <MainContent>
        <CanvasWrapper>
          {pixelColors && pixelColors.length > 0 ? (
            <Scene3D 
              pixelColors={pixelColors}
              centroids={centroids}
              assignments={result?.assignments || []}
              isClustering={isClustering}
            />
          ) : (
            <Placeholder>Please upload an image to begin.</Placeholder>
          )}
        </CanvasWrapper>
        
        {result && !isClustering && (
          <ResultDisplay 
            centroids={formatCentroidsForDisplay(finalCentroids)}
            originalImageURL={originalImageURL}
            fullImageData={fullImageData}
            imageSize={originalImage ? { width: originalImage.width, height: originalImage.height } : { width: 0, height: 0 }}
            isClustering={isClustering}
          />
        )}
      </MainContent>

      <SidePanel>
        <ImageUploader onImageUpload={handleImageUpload} disabled={isClustering} />
        <ControlPanel
          k={k}
          onKChange={setK}
          maxIterations={maxIterations}
          onMaxIterationsChange={setMaxIterations}
          onStart={handleStart}
          onReset={handleReset}
          isClustering={isClustering}
          progress={result?.progress ?? 0}
          iteration={result?.currentIteration ?? 0}
          mse={result?.mse ?? 0}
          psnr={result?.psnr ?? 0}
          pixelCount={pixelColors?.length ? pixelColors.length / 3 : 0}
        />
      </SidePanel>
    </Container>
  );
};

export default KMeansVisualizationPage;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #1a1a1a;
  color: white;
  overflow: hidden; /* Prevent scrolling on the main container */
`;

const MainContent = styled.div`
  flex-grow: 1;
  position: relative; /* This is crucial for absolute positioning of children */
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #555;
`;

const SidePanel = styled.div`
  width: 350px;
  flex-shrink: 0; /* Prevent the side panel from shrinking */
  background-color: #242424;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  z-index: 20; /* Ensure side panel is above the canvas */
`;

