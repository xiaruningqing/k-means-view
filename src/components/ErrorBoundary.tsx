import { Component, type ErrorInfo, type ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  color: #ff4d4f;
  background-color: #2a2a2a;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ff4d4f;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.pre`
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #1e1e1e;
  padding: 1rem;
  border-radius: 4px;
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>3D Scene Failed to Render</ErrorTitle>
          <p>Something went wrong inside the 3D visualization component.</p>
          {this.state.error && (
            <ErrorMessage>
              {this.state.error.name}: {this.state.error.message}
            </ErrorMessage>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 