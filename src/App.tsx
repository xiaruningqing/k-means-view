import styled, { createGlobalStyle } from 'styled-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import KMeansVisualizationPage from './pages/KMeansVisualizationPage';
import VideoCenterPage from './pages/VideoCenterPage';
import IntroductionPage from './pages/IntroductionPage';
import Navbar from './components/Navbar';

const AppContainer = styled.div`
  /* You can add global container styles here if needed */
`;

const ContentContainer = styled.main`
  /* Styles for the main content area below the navbar */
`;

function App() {
  return (
    <AppContainer>
      <Navbar />
      <ContentContainer>
        <Routes>
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/visualize" element={<KMeansVisualizationPage />} />
          <Route path="/video-center" element={<VideoCenterPage />} />
        </Routes>
      </ContentContainer>
    </AppContainer>
  );
}

export default App; 