import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../utils/cn';
import { uploadFile } from '../../lib/supabaseClient';
import Icon from '../AppIcon';
import Button from './Button';

const FileUpload = ({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUpload,
  onFilesUploaded, // New prop for multiple files
  preview,
  className,
  previewClassName,
  type = 'default', // 'default' | 'avatar' | 'cover' | 'multiple'
  error,
  placeholder = 'Kéo thả file hoặc click để chọn',
  multiple = false,
  bucket = 'job-attachments',
  files = [], // For multiple file mode
  onRemoveFile, // For removing files
  showPreview = true,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFilesUpload = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(filesToUpload).map(async (file) => {
        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" vượt quá ${Math.round(maxSize / 1024 / 1024)}MB`);
        }

        // Upload to Supabase Storage
        const { publicURL, error } = await uploadFile(file, bucket);
        
        if (error) {
          throw new Error(`Lỗi tải file "${file.name}": ${error.message}`);
        }

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: publicURL,
          uploadedAt: new Date().toISOString()
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      if (type === 'multiple' && onFilesUploaded) {
        onFilesUploaded(uploadedFiles);
      } else if (onUpload && uploadedFiles.length > 0) {
        onUpload(uploadedFiles[0]);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      if (type === 'multiple') {
        handleFilesUpload(acceptedFiles);
      } else {
        const file = acceptedFiles[0];
        if (onUpload) {
          // For backward compatibility - single file mode
          onUpload(file);
        } else {
          // Use new upload handler
          handleFilesUpload([file]);
        }
      }
    }
  }, [onUpload, onFilesUploaded, type, maxSize, bucket]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: type === 'multiple' || multiple,
    disabled: uploading,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return 'FileImage';
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'FileText';
    return 'File';
  };

  const renderMultipleFiles = () => {
    if (type !== 'multiple' || !files || files.length === 0) return null;

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Tài liệu đã tải lên:</h4>
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <Icon name={getFileIcon(file.type)} size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {file.url && (
                <Button asChild variant="ghost" size="sm">
                  <a 
                    href={file.url} 
                    download={file.name}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Icon name="Download" size={12} />
                  </a>
                </Button>
              )}
              {onRemoveFile && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onRemoveFile(file.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Icon name="X" size={12} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPreview = () => {
    if (!showPreview || !preview) return null;

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
        <Icon name="File" size={16} />
        <span>{preview.split('/').pop()}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          uploading && "opacity-50 cursor-not-allowed",
          error && "border-destructive",
          className
        )}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-2">
            <Icon name="Loader2" size={32} className="mx-auto text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải lên...</p>
          </div>
        ) : isDragActive ? (
          <div className="space-y-2">
            <Icon name="Upload" size={32} className="mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">
              Thả file vào đây...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Icon name="Upload" size={32} className="mx-auto text-muted-foreground" />
            <div className="text-muted-foreground">
              <span className="text-primary font-medium">{placeholder}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Tối đa {Math.round(maxSize / 1024 / 1024)}MB {multiple || type === 'multiple' ? 'mỗi file' : ''}
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {type === 'multiple' ? renderMultipleFiles() : renderPreview()}
    </div>
  );
};

export default FileUpload;
