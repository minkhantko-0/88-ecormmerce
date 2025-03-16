'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  className?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  file,
  className
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      if (acceptedFiles && acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    multiple: false,
    accept: {
      'image/*': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-md border-2 border-dashed p-4 text-center',
        className
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the image here...</p>
      ) : file ? (
        <p>Selected: {file.name}</p>
      ) : (
        <p>Drag and drop an image here, or click to select one</p>
      )}
    </div>
  );
};
