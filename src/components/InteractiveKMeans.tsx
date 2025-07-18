import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaRedo, FaArrowRight, FaMousePointer, FaBullseye, FaUsers, FaSync, FaChartBar } from 'react-icons/fa';

const DemoContainer = styled.div`
  background: #1f1f1f;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CanvasContainer = styled.div`
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1 / 1;
  background: #2a2a2a;
  border-radius: 8px;
  position: relative;
  border: 1px solid #444;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled(motion.button)`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const StatusText = styled(motion.p)`
  color: #ccc;
  font-size: 1rem;
  font-weight: 500;
  min-width: 250px;
  text-align: center;
`;

const StepDescription = styled(motion.div)`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #2a2a2a;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  border: 1px solid #444;
  color: #ddd;
  line-height: 1.7;
  text-align: left;

  h4 {
    color: #4a90e2;
    margin-top: 0;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const Point = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
`;

const Centroid = styled(motion.div)`
  width: 24px;
  height: 24px;
  position: absolute;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
`;

const PALETTE = ['#e63946', '#457b9d', '#52b788', '#fca311', '#9d4edd'];
const NUM_POINTS = 100;
const K = 4;

type PointType = { x: number; y: number; cluster?: number };
type CentroidType = { x: number; y: number; cluster: number };

// Helper to calculate distance
const getDistance = (p1: PointType, p2: PointType) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const InteractiveKMeans: React.FC = () => {
  const [points, setPoints] = useState<PointType[]>([]);
  const [centroids, setCentroids] = useState<CentroidType[]>([]);
  const [stage, setStage] = useState<'initial' | 'started' | 'assigned' | 'updated' | 'done'>('initial');
  const [iteration, setIteration] = useState(0);

  const generatePoints = useCallback(() => {
    const newPoints: PointType[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      newPoints.push({ x: Math.random() * 100, y: Math.random() * 100 });
    }
    setPoints(newPoints);
  }, []);
  
  useEffect(() => {
    generatePoints();
  }, [generatePoints]);

  const initializeCentroids = () => {
    const newCentroids: CentroidType[] = [];
    const pointsCopy = [...points];
    for (let i = 0; i < K; i++) {
      const randIndex = Math.floor(Math.random() * pointsCopy.length);
      const randPoint = pointsCopy.splice(randIndex, 1)[0];
      newCentroids.push({ ...randPoint, cluster: i });
    }
    setCentroids(newCentroids);
    setStage('started');
    setIteration(1);
  };

  const assignToClusters = () => {
    const newPoints = points.map(p => {
      let minDistance = Infinity;
      let cluster = -1;
      centroids.forEach(c => {
        const distance = getDistance(p, c);
        if (distance < minDistance) {
          minDistance = distance;
          cluster = c.cluster;
        }
      });
      return { ...p, cluster };
    });
    setPoints(newPoints);
    setStage('assigned');
  };

  const updateCentroids = () => {
    let hasChanged = false;
    const newCentroids = centroids.map(c => {
      const clusterPoints = points.filter(p => p.cluster === c.cluster);
      if (clusterPoints.length === 0) return c;
      
      const sumX = clusterPoints.reduce((acc, p) => acc + p.x, 0);
      const sumY = clusterPoints.reduce((acc, p) => acc + p.y, 0);
      const newCentroid = { ...c, x: sumX / clusterPoints.length, y: sumY / clusterPoints.length };

      if(getDistance(c, newCentroid) > 0.01) {
        hasChanged = true;
      }
      return newCentroid;
    });

    setCentroids(newCentroids);
    if(hasChanged) {
        setStage('updated');
        setIteration(i => i + 1);
    } else {
        setStage('done');
    }
  };

  const handleNextStep = () => {
    switch (stage) {
      case 'initial':
        initializeCentroids();
        break;
      case 'started':
      case 'updated':
        assignToClusters();
        break;
      case 'assigned':
        updateCentroids();
        break;
    }
  };

  const reset = () => {
    generatePoints();
    setCentroids([]);
    setStage('initial');
    setIteration(0);
  };

  const getStatusText = () => {
    switch (stage) {
      case 'initial':
        return '点击“开始”来随机初始化聚类中心。';
      case 'started':
        return `第 ${iteration} 轮：已初始化中心，请点击“下一步”为数据点分配簇。`;
      case 'assigned':
        return `第 ${iteration} 轮：已分配簇，请点击“下一步”更新中心位置。`;
      case 'updated':
        return `第 ${iteration} 轮：中心已更新，请点击“下一步”重新分配簇。`;
      case 'done':
        return `算法收敛！总共进行了 ${iteration} 轮迭代。`;
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch(stage) {
      case 'initial':
        return (
          <>
            <h4><FaMousePointer /> 准备开始</h4>
            <p>欢迎来到交互式K-Means演示！这里随机生成了一堆数据点。您的任务是将它们分成 <strong>{K}</strong> 个簇。请点击上方的“开始”按钮，迈出第一步。</p>
          </>
        )
      case 'started':
        return (
          <>
            <h4><FaBullseye /> 步骤一：初始化中心</h4>
            <p>我们在数据空间中随机选取了 <strong>{K}</strong> 个点作为初始的聚类中心（即每个簇的临时“首领”）。接下来，我们将根据这些中心来为所有数据点分组。</p>
          </>
        )
      case 'assigned':
         return (
          <>
            <h4><FaUsers /> 步骤二：分配数据点</h4>
            <p>每个数据点都计算了它与所有聚类中心的距离，并“投靠”了离它最近的那个中心。您可以看到，数据点已根据其归属的簇染上了不同的颜色。</p>
          </>
        )
      case 'updated':
        return (
          <>
            <h4><FaSync /> 步骤三：更新中心位置</h4>
            <p>我们重新计算了每个簇内所有数据点的“平均位置”（即质心），并将聚类中心移动到了这个新位置。这是为了让中心能更好地代表其所有成员。这个“分配-更新”的过程将不断重复。</p>
          </>
        )
      case 'done':
        return (
          <>
            <h4><FaChartBar /> 算法收敛</h4>
            <p>经过 <strong>{iteration}</strong> 轮迭代，聚类中心的位置不再发生显著变化，数据点的归属已经稳定。聚类完成！您可以点击“重置”来开始新一轮的演示。</p>
          </>
        )
    }
  }
  
  return (
    <DemoContainer>
      <h2>交互式 K-Means 演示</h2>
      <CanvasContainer>
        <AnimatePresence>
          {points.map((p, i) => (
            <Point
              key={`p-${i}`}
              style={{
                left: `calc(${p.x}% - 6px)`,
                top: `calc(${p.y}% - 6px)`,
                background: p.cluster !== undefined ? PALETTE[p.cluster] : '#ccc',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
            />
          ))}
          {centroids.map((c, i) => (
            <Centroid
              key={`c-${i}`}
              animate={{
                left: `calc(${c.x}% - 12px)`,
                top: `calc(${c.y}% - 12px)`,
              }}
              style={{ background: PALETTE[c.cluster] }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          ))}
        </AnimatePresence>
      </CanvasContainer>
      <ControlsContainer>
        <Button onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FaRedo /> 重置
        </Button>
        <Button onClick={handleNextStep} disabled={stage === 'done'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {stage === 'initial' ? <FaPlay/> : <FaArrowRight />}
          {stage === 'initial' ? '开始' : '下一步'}
        </Button>
      </ControlsContainer>
       <StatusText key={stage} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        {getStatusText()}
      </StatusText>
      <AnimatePresence mode="wait">
          <StepDescription key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {getStepDescription()}
          </StepDescription>
      </AnimatePresence>
    </DemoContainer>
  );
};

export default InteractiveKMeans; 