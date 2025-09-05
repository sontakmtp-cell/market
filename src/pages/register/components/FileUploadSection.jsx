import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadSection = ({ title, description, acceptedTypes, maxSize, onFileSelect, selectedFile, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    if (files?.length > 0) {
      handleFileSelection(files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    const fileExtension = file?.name?.split('.')?.pop()?.toLowerCase();
    if (!acceptedTypes?.includes(fileExtension)) {
      return;
    }

    // Validate file size (maxSize in MB)
    if (file?.size > maxSize * 1024 * 1024) {
      return;
    }

    onFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-error bg-error/5' :'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              error ? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name="Upload" size={24} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Kéo thả tệp vào đây hoặc
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef?.current?.click()}
              >
                Chọn tệp
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Định dạng: {acceptedTypes?.join(', ')?.toUpperCase()}</p>
              <p>Kích thước tối đa: {maxSize}MB</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes?.map(type => `.${type}`)?.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile?.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-error"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FileUploadSection;