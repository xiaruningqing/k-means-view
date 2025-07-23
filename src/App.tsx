import { Routes, Route } from 'react-router-dom';
import KMeansVisualizationPage from './pages/KMeansVisualizationPage';
import IntroductionPage from './pages/IntroductionPage';
import VideoCenterPage from './pages/VideoCenterPage';
import Navbar from './components/Navbar';
import styled, { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #121212;
    color: #fff;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;


function App() {
  return (
    <>
       <GlobalStyle />
       <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/visualize" element={<KMeansVisualizationPage />} />
          <Route path="/video-center" element={<VideoCenterPage />} />
        </Routes>
      </AppContainer>
    </>
  );
}

export default App; 