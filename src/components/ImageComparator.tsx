import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0; /* Prevents extra space below images */
`;

const BaseImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const RightImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Scroller = styled.div.attrs<{ style: React.CSSProperties }>(props => ({
  style: props.style,
}))`
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 4px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  cursor: ew-resize;
  
  &::before {
    content: '◀▶';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.8);
    color: black;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
  }
`;

interface ImageComparatorProps {
  leftImage: string;
  rightImage: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ leftImage, rightImage }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, newPosition)));
  }, []);
  
  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    e.preventDefault();
  };
  
  const onMouseUp = () => {
    isDragging.current = false;
  };
  
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <Wrapper 
      ref={containerRef} 
      onMouseUp={onMouseUp} 
      onMouseLeave={onMouseUp} 
      onMouseMove={onMouseMove}
      onTouchEnd={onMouseUp}
      onTouchCancel={onMouseUp}
      onTouchMove={onTouchMove}
    >
      <BaseImage src={leftImage} alt="Original" />
      <RightImageWrapper style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <BaseImage src={rightImage} alt="Clustered" style={{ position: 'absolute', top: 0, left: 0 }}/>
      </RightImageWrapper>
      <Scroller style={{ left: `${position}%` }} onMouseDown={onMouseDown} onTouchStart={onMouseDown} />
    </Wrapper>
  );
};

export default ImageComparator; 