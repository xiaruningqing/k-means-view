import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import styled from 'styled-components';
import * as THREE from 'three';

interface Scene3DProps {
  pixelColors: Float32Array;
  centroids: number[];
  isClustering: boolean;
  assignments: number[];
}

// This is the core component that renders and animates the point cloud.
const KmeansPointCloud = ({ pixelColors, centroids, assignments, isClustering }: Scene3DProps) => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // A soft circular texture for the points to make them look like orbs instead of squares.
  // const pointTexture = useLoader(THREE.TextureLoader, '/particle.png');

  // Memoize initial positions and colors. This is calculated only when pixelColors change.
  // This declarative approach ensures data is ready before rendering, preventing crashes.
  const [initialPositions, colors] = useMemo(() => {
    console.log('[Scene3D] Recalculating geometry. Received pixelColors length:', pixelColors?.length);

    if (!pixelColors || pixelColors.length === 0) {
      console.log('[Scene3D] pixelColors is empty or null, returning empty arrays.');
      return [new Float32Array(), new Float32Array()];
    }

    const totalPixels = pixelColors.length / 3;
    if (pixelColors.length % 3 !== 0) {
        console.error('[Scene3D] Error: pixelColors length is not a multiple of 3.');
        return [new Float32Array(), new Float32Array()];
    }

    console.log(`[Scene3D] Processing ${totalPixels} pixels.`);
    const pos = new Float32Array(totalPixels * 3);
    const col = new Float32Array(totalPixels * 3);
    for (let i = 0; i < totalPixels; i++) {
      pos[i * 3 + 0] = pixelColors[i * 3 + 0] - 128;
      pos[i * 3 + 1] = pixelColors[i * 3 + 1] - 128;
      pos[i * 3 + 2] = pixelColors[i * 3 + 2] - 128;
      col[i * 3 + 0] = pixelColors[i * 3 + 0] / 255;
      col[i * 3 + 1] = pixelColors[i * 3 + 1] / 255;
      col[i * 3 + 2] = pixelColors[i * 3 + 2] / 255;
    }
    console.log('[Scene3D] Geometry calculation finished successfully.');
    return [pos, col];
  }, [pixelColors]);

  // Memoize centroid positions.
  const centroidPositions = useMemo(() => {
    if (!centroids || centroids.length === 0) return [];
    const positions = [];
    for (let i = 0; i < centroids.length / 3; i++) {
      positions.push(
        new THREE.Vector3(
          centroids[i * 3 + 0] - 128,
          centroids[i * 3 + 1] - 128,
          centroids[i * 3 + 2] - 128
        )
      );
    }
    return positions;
  }, [centroids]);

  // The animation logic, running on every frame.
  useFrame((_, delta) => {
    if (!pointsRef.current?.geometry?.attributes?.position) return;

    const shouldAnimateToCentroids = !isClustering && assignments.length > 0;
    const currentPosAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < currentPosAttr.count; i++) {
      let targetPos: [number, number, number];

      if (shouldAnimateToCentroids) {
        const centroidIndex = assignments[i];
        if (centroidIndex !== undefined && centroids[centroidIndex * 3] !== undefined) {
          targetPos = [
            centroids[centroidIndex * 3 + 0] - 128,
            centroids[centroidIndex * 3 + 1] - 128,
            centroids[centroidIndex * 3 + 2] - 128,
          ];
        } else { // Fallback if assignment data is somehow invalid
          targetPos = [initialPositions[i * 3 + 0], initialPositions[i * 3 + 1], initialPositions[i * 3 + 2]];
        }
      } else { // Default state: return to initial position
        targetPos = [initialPositions[i * 3 + 0], initialPositions[i * 3 + 1], initialPositions[i * 3 + 2]];
      }
      
      const currentPoint = new THREE.Vector3(currentPosAttr.getX(i), currentPosAttr.getY(i), currentPosAttr.getZ(i));
      const targetPoint = new THREE.Vector3(...targetPos);

      // Smoothly interpolate (lerp) towards the target position.
      // Adjust the final multiplier (e.g., delta * 1.0) to change the animation speed.
      currentPoint.lerp(targetPoint, delta * 1.0);
      currentPosAttr.setXYZ(i, currentPoint.x, currentPoint.y, currentPoint.z);
    }
    currentPosAttr.needsUpdate = true;
  });

  return (
    <>
      {/* The main point cloud */}
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <PointMaterial
          // map={pointTexture}
          vertexColors
          size={5}
          sizeAttenuation
          transparent
          alphaTest={0.5}
        />
      </Points>
      
      {/* The centroid markers */}
      {centroidPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[4, 16, 16]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
        </mesh>
      ))}
    </>
  );
};

const Scene3D: React.FC<Scene3DProps> = (props) => {
  return (
    <Container>
      <Canvas camera={{ position: [0, 0, 300], fov: 75 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[150, 150, 150]} intensity={1} />

        {props.pixelColors && props.pixelColors.length > 0 && (
          <KmeansPointCloud {...props} />
        )}
        
        <OrbitControls enableZoom autoRotate autoRotateSpeed={0.4} />
        <axesHelper args={[150]} />
        <gridHelper args={[300, 10]} rotation-x={Math.PI / 2} />

        {/* Post-processing for the bloom/glow effect */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} intensity={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </Container>
  );
};

export default Scene3D;

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #111;
`; 