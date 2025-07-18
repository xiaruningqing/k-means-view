import { useState, useEffect, useRef, useCallback } from 'react';
import type { KMeansResult } from '../types';

const MAX_PIXELS = 50000;

export const useKMeans = () => {
  const [result, setResult] = useState<KMeansResult | null>(null);
  const [pixelColors, setPixelColors] = useState<Float32Array>(new Float32Array());
  const [centroids, setCentroids] = useState<number[]>([]);
  const [isClustering, setIsClustering] = useState(false);

  const workerRef = useRef<Worker>();

  const resetState = useCallback(() => {
    setResult(null);
    setCentroids([]);
    setIsClustering(false);
    setPixelColors(new Float32Array());
  }, []);

  const extractPixels = useCallback((imageData: ImageData): Float32Array => {
    const originalPixelCount = imageData.width * imageData.height;
    const shouldUseSampling = originalPixelCount > MAX_PIXELS;
    const pixelCount = shouldUseSampling ? MAX_PIXELS : originalPixelCount;
    
    const pixels = new Float32Array(pixelCount * 3);
    
    if (shouldUseSampling) {
        const selectedIndices = new Set<number>();
        while(selectedIndices.size < MAX_PIXELS) {
            const randomIndex = Math.floor(Math.random() * originalPixelCount);
            if (!selectedIndices.has(randomIndex)) {
                selectedIndices.add(randomIndex);
            }
        }

        let i = 0;
        selectedIndices.forEach(index => {
            pixels[i * 3 + 0] = imageData.data[index * 4 + 0];
            pixels[i * 3 + 1] = imageData.data[index * 4 + 1];
            pixels[i * 3 + 2] = imageData.data[index * 4 + 2];
            i++;
        });
    } else {
        for (let i = 0; i < originalPixelCount; i++) {
            pixels[i * 3 + 0] = imageData.data[i * 4 + 0];
            pixels[i * 3 + 1] = imageData.data[i * 4 + 1];
            pixels[i * 3 + 2] = imageData.data[i * 4 + 2];
        }
    }
    
    return pixels;
  }, []);


  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/kmeans.worker.ts', import.meta.url), { type: 'module' });

    workerRef.current.onmessage = (event: MessageEvent<any>) => {
      const { type, payload } = event.data;
      if (type === 'progress') {
        setCentroids(payload.centroids);
        setResult(prev => ({
           ...(prev as KMeansResult),
           assignments: payload.assignments, // This is the key change
           progress: payload.progress,
           currentIteration: payload.currentIteration,
        }));
      } else if (type === 'complete') {
        const finalResult: KMeansResult = {
          centroids: payload.centroids,
          assignments: Array.from(payload.assignments),
          progress: 1,
          currentIteration: payload.currentIteration,
          isClustering: false,
          mse: payload.mse,
          psnr: payload.psnr,
        };
        setResult(finalResult);
        setCentroids(finalResult.centroids);
        setIsClustering(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startKMeans = useCallback((k: number, maxIterations: number) => {
    if (pixelColors.length > 0 && workerRef.current) {
       setResult(null);
       setCentroids([]);
       setIsClustering(true);
       setResult({
         centroids: [],
         assignments: [],
         progress: 0,
         currentIteration: 0,
         isClustering: true,
         mse: 0,
         psnr: 0,
       });
       workerRef.current.postMessage({
         type: 'start',
         payload: { pixelColors, k, maxIterations },
       });
    }
  }, [pixelColors]);
  
  const resetKMeans = useCallback(() => {
     resetState();
  }, [resetState]);

  return { result, pixelColors, setPixelColors, centroids, isClustering, startKMeans, resetKMeans, extractPixels };
};