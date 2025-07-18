// K-means clustering algorithm implementation in a Web Worker

// Helper function to initialize centroids using K-means++
const kmeansPlusPlus = (pixels: Float32Array, k: number, pixelCount: number): number[][] => {
    const centroids: number[][] = [];
    // 1. Choose one center uniformly at random from among the data points.
    const firstCentroidIndex = Math.floor(Math.random() * pixelCount);
    centroids.push([pixels[firstCentroidIndex * 3], pixels[firstCentroidIndex * 3 + 1], pixels[firstCentroidIndex * 3 + 2]]);

    const distances = new Float32Array(pixelCount).fill(Infinity);

    for (let i = 1; i < k; i++) {
        let sumDist = 0;
        // 2. For each data point x, compute D(x), the distance between x and the nearest center that has already been chosen.
        for (let j = 0; j < pixelCount; j++) {
            const r1 = pixels[j * 3];
            const g1 = pixels[j * 3 + 1];
            const b1 = pixels[j * 3 + 2];
            
            let minDistance = Infinity;
            for (const centroid of centroids) {
                const r2 = centroid[0];
                const g2 = centroid[1];
                const b2 = centroid[2];
                const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
                minDistance = Math.min(minDistance, distance);
            }
            distances[j] = minDistance;
            sumDist += distances[j];
        }

        // 3. Choose one new data point x at random, with probability proportional to D(x)^2.
        const r = Math.random() * sumDist;
        let sum = 0;
        let nextCentroidIndex = -1;
        for (let j = 0; j < pixelCount; j++) {
            sum += distances[j];
            if (sum >= r) {
                nextCentroidIndex = j;
                break;
            }
        }
        centroids.push([pixels[nextCentroidIndex * 3], pixels[nextCentroidIndex * 3 + 1], pixels[nextCentroidIndex * 3 + 2]]);
    }
    return centroids;
};


self.onmessage = (e: MessageEvent<any>) => {
  const { type, payload } = e.data;
  if (type === 'start') {
    const { pixelColors, k, maxIterations } = payload;
    const pixelCount = pixelColors.length / 3;

    // Initialize centroids using K-means++
    let centroids = kmeansPlusPlus(pixelColors, k, pixelCount);
    const assignments = new Int32Array(pixelCount);
    let finalIteration = 0;

    for (let iter = 0; iter < maxIterations; iter++) {
      finalIteration = iter + 1;
      // Assignment step: Assign each pixel to the nearest centroid
      let changed = false;
      for (let i = 0; i < pixelCount; i++) {
        let minDistance = Infinity;
        let bestCentroid = 0;
        const r1 = pixelColors[i * 3];
        const g1 = pixelColors[i * 3 + 1];
        const b1 = pixelColors[i * 3 + 2];

        for (let j = 0; j < k; j++) {
            const r2 = centroids[j][0];
            const g2 = centroids[j][1];
            const b2 = centroids[j][2];
            const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                bestCentroid = j;
            }
        }
        if (assignments[i] !== bestCentroid) {
          changed = true;
        }
        assignments[i] = bestCentroid;
      }

      // Update step: Recalculate centroids based on the mean of assigned pixels
      const newCentroids: number[][] = Array(k).fill(0).map(() => [0, 0, 0]);
      const counts = new Uint32Array(k);

      for (let i = 0; i < pixelCount; i++) {
        const centroidIndex = assignments[i];
        newCentroids[centroidIndex][0] += pixelColors[i * 3];
        newCentroids[centroidIndex][1] += pixelColors[i * 3 + 1];
        newCentroids[centroidIndex][2] += pixelColors[i * 3 + 2];
        counts[centroidIndex]++;
      }

      for (let i = 0; i < k; i++) {
        if (counts[i] > 0) {
          newCentroids[i][0] /= counts[i];
          newCentroids[i][1] /= counts[i];
          newCentroids[i][2] /= counts[i];
        } else {
            // Reinitialize empty clusters to a random pixel
            const randomIndex = Math.floor(Math.random() * pixelCount);
            newCentroids[i] = [pixelColors[randomIndex * 3], pixelColors[randomIndex * 3 + 1], pixelColors[randomIndex * 3 + 2]];
        }
      }
      centroids = newCentroids;
      
      // Post progress update on each iteration
      self.postMessage({
        type: 'progress',
        payload: {
          centroids: centroids.flat(),
          assignments: Array.from(assignments), // Send a plain array copy
          progress: (iter + 1) / maxIterations,
          currentIteration: iter + 1
        }
      });

      // Check for convergence
      if (!changed) {
        break;
      }
    }

    // Final pass to compute MSE and PSNR
    let mse = 0;
    for (let i = 0; i < pixelCount; i++) {
      const centroid = centroids[assignments[i]];
      const r_dist = pixelColors[i*3] - centroid[0];
      const g_dist = pixelColors[i*3+1] - centroid[1];
      const b_dist = pixelColors[i*3+2] - centroid[2];
      const distance = r_dist**2 + g_dist**2 + b_dist**2;
      mse += distance;
    }
    mse /= (pixelCount * 3);
    const psnr = 20 * Math.log10(255) - 10 * Math.log10(mse);

    // Send final result with assignments
    self.postMessage({
      type: 'complete',
      payload: { 
        centroids: centroids.flat(), 
        assignments: Array.from(assignments), // Send a plain array copy
        mse, 
        psnr,
        currentIteration: finalIteration
      }
    });
  }
}; 