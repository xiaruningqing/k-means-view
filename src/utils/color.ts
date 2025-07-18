// src/utils/color.ts

export type RGBColor = [number, number, number];

export const euclideanDistance = (p1: RGBColor, p2: RGBColor): number => {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) +
    Math.pow(p1[1] - p2[1], 2) +
    Math.pow(p1[2] - p2[2], 2)
  );
}; 