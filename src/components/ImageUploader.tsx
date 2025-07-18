import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

const UploadContainer = styled.div<{ $isDragOver: boolean; $hasPreview: boolean }>`
  border: 2px dashed #555;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  background-size: cover;
  background-position: center;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${props => props.$isDragOver && css`
    border-color: #4a90e2;
    background-color: rgba(74, 144, 226, 0.2);
  `}
  
  ${props => props.$hasPreview && css`
    border-style: solid;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 6px;
    }
  `}

  &:hover {
    border-color: #777;
  }
`;

const UploadText = styled.p`
  color: #aaa;
  z-index: 1;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
          setPreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <>
      <UploadContainer
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        $isDragOver={isDragOver}
        $hasPreview={!!previewURL}
        style={{ backgroundImage: previewURL ? `url(${previewURL})` : 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {!previewURL && <UploadText>点击或拖拽图片到此区域</UploadText>}
        {previewURL && <UploadText style={{ color: 'white', fontWeight: 'bold' }}>点击或拖拽以更换图片</UploadText>}
      </UploadContainer>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
      />
    </>
  );
};

export default ImageUploader; 