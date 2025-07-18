import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaBullseye, FaUsers, FaSync, FaChartBar, FaPalette, FaImage } from 'react-icons/fa';
import InteractiveKMeans from '../components/InteractiveKMeans';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  padding: 2rem 4rem;
  color: #fff;
  background-color: #121212;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-size: 3rem;
    color: #4a90e2;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.2rem;
    color: #aaa;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;

  h2 {
    font-size: 2rem;
    border-bottom: 2px solid #4a90e2;
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: #1f1f1f;
  border-radius: 8px;
  padding: 2rem;
  border: 1px solid #333;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }

  h3 {
    font-size: 1.5rem;
    color: #4a90e2;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  p {
    color: #ccc;
    line-height: 1.6;
  }
`;


const IntroductionPage: React.FC = () => {
  return (
    <PageContainer>
      <Header>
        <h1>揭秘 K-Means 聚类算法</h1>
        <p>一个强大而直观的无监督学习工具，探索数据背后的秘密</p>
      </Header>

      <Section>
        <h2><FaBullseye />核心思想：物以类聚</h2>
        <CardGrid>
          <Card>
            <h3>1. 随机起点</h3>
            <p>算法首先会随机在数据空间中选择 'K' 个点，作为初始的聚类中心。</p>
          </Card>
          <Card>
            <h3>2. 分配归属</h3>
            <p>接着，计算每一个数据点到这 K 个中心的距离，并将其分配给距离最近的那个中心，形成 K 个簇。</p>
          </Card>
          <Card>
            <h3>3. 更新中心</h3>
            <p>然后，重新计算每个簇中所有数据点的平均位置，将这个新的平均位置作为该簇的新聚类中心。</p>
          </Card>
           <Card>
            <h3>4. 迭代收敛</h3>
            <p>不断重复“分配-更新”这两个步骤，直到聚类中心的位置不再发生显著变化，算法收敛，聚类完成。</p>
          </Card>
        </CardGrid>
      </Section>

      <Section>
        <h2><FaChartBar />应用场景</h2>
         <CardGrid>
          <Card>
            <h3><FaUsers />客户分群</h3>
            <p>根据用户的购买行为、浏览历史等特征，将用户分成不同群体，以实现精准营销。</p>
          </Card>
          <Card>
            <h3><FaImage />图像压缩</h3>
            <p>将图像中的成千上万种颜色，用 K 个核心颜色来代表，大幅减少图片大小。我们的可视化工具正是基于此原理。</p>
          </Card>
           <Card>
            <h3><FaPalette />颜色量化</h3>
            <p>从图片中提取主题色板，可用于UI设计、艺术创作等领域。</p>
          </Card>
        </CardGrid>
      </Section>

      <Section>
        <h2><FaSync />动手试一试</h2>
        <InteractiveKMeans />
      </Section>
    </PageContainer>
  );
};

export default IntroductionPage; 