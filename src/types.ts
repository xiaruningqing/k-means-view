export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface Pixel {
  color: RGBColor;
  position: [number, number, number];
}

export interface KMeansResult {
  centroids: number[];
  assignments: number[];
  progress: number;
  currentIteration: number;
  isClustering: boolean;
  mse: number;
  psnr: number;
} 