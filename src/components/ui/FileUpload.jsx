import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../utils/cn';

const FileUpload = ({
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  preview,
  className,
  previewClassName,
  type = 'default', // 'default' | 'avatar' | 'cover'
  error,
  placeholder = 'Kéo thả file hoặc click để chọn',
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      onUpload?.(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const renderPreview = () => {
    if (!preview) return null;

    if (type === 'avatar') {
      return (
        <img
          src={preview}
          alt="Avatar preview"
          className={cn(
            "w-24 h-24 rounded-full object-cover",
            previewClassName
          )}
        />
      );
    }

    if (type === 'cover') {
      return (
        <img
          src={preview}
          alt="Cover preview"
          className={cn(
            "w-full h-32 object-cover rounded-lg",
            previewClassName
          )}
        />
      );
    }

    if (preview.startsWith('data:image')) {
      return (
        <img
          src={preview}
          alt="File preview"
          className={cn(
            "max-w-[200px] max-h-[200px] object-contain",
            previewClassName
          )}
        />
      );
    }

    // For non-image files, show filename
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>{preview.split('/').pop()}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          error && "border-destructive",
          className
        )}
      >
        <input {...getInputProps()} />
        
        {isDragActive ? (
          <p className="text-sm text-muted-foreground">
            Thả file vào đây...
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {placeholder}
            </p>
            <p className="text-xs text-muted-foreground">
              Tối đa {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {renderPreview()}
    </div>
  );
};

export default FileUpload;
