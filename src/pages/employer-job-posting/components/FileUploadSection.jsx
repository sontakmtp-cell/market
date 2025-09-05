import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FileUploadSection = ({ data, onChange, errors }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const allowedTypes = {
    documents: {
      types: ['.pdf', '.doc', '.docx', '.txt'],
      maxSize: 5 * 1024 * 1024, // 5MB
      description: 'PDF, DOC, DOCX, TXT (tối đa 5MB)'
    },
    images: {
      types: ['.jpg', '.jpeg', '.png', '.gif'],
      maxSize: 2 * 1024 * 1024, // 2MB
      description: 'JPG, PNG, GIF (tối đa 2MB)'
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e, category) => {
    e?.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files, category);
  };

  const handleFileSelect = (e, category) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files, category);
  };

  const validateFile = (file, category) => {
    const config = allowedTypes?.[category] || allowedTypes?.documents;
    
    // Check file type
    const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
    if (!config?.types?.includes(fileExtension)) {
      return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${config?.description}`;
    }
    
    // Check file size
    if (file?.size > config?.maxSize) {
      const maxSizeMB = config?.maxSize / (1024 * 1024);
      return `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFiles = async (files, category) => {
    const validFiles = [];
    const errors = [];

    for (const file of files) {
      const error = validateFile(file, category);
      if (error) {
        errors?.push(`${file?.name}: ${error}`);
      } else {
        validFiles?.push(file);
      }
    }

    if (errors?.length > 0) {
      alert(errors?.join('\n'));
      return;
    }

    // Simulate file upload with progress
    for (const file of validFiles) {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Create file object with metadata
      const fileObj = {
        id: fileId,
        file,
        name: file?.name,
        size: file?.size,
        type: file?.type,
        uploadedAt: new Date()?.toISOString(),
        url: URL.createObjectURL(file) // For preview
      };

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min((prev?.[fileId] || 0) + 20, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            // Remove from progress tracking
            const { [fileId]: removed, ...rest } = prev;
            return rest;
          }
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);

      // Add file to the appropriate category
      const currentFiles = data?.[category] || [];
      onChange({
        [category]: [...currentFiles, fileObj]
      });
    }
  };

  const removeFile = (fileId, category) => {
    const currentFiles = data?.[category] || [];
    const updatedFiles = currentFiles?.filter(file => file?.id !== fileId);
    onChange({
      [category]: updatedFiles
    });
    
    // Remove from progress if still uploading
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const FileUploadArea = ({ category, title, description, icon, accept }) => (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground flex items-center">
        <Icon name={icon} size={20} className="mr-2" />
        {title}
      </h4>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
          dragOver
            ? 'border-primary bg-primary/5' :'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, category)}
      >
        <Icon name="Upload" size={32} className="mx-auto mb-4 text-muted-foreground" />
        <p className="text-foreground font-medium mb-2">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-muted-foreground text-sm mb-4">
          {description}
        </p>
        
        <input
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFileSelect(e, category)}
          className="hidden"
          id={`file-input-${category}`}
        />
        
        <Button
          variant="outline"
          onClick={() => document.getElementById(`file-input-${category}`)?.click()}
        >
          Chọn file
        </Button>
      </div>

      {/* File List */}
      {data?.[category]?.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Đã tải lên ({data?.[category]?.length} file):
          </p>
          
          {data?.[category]?.map((file) => (
            <div
              key={file?.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={file?.type?.startsWith('image/') ? 'Image' : 'FileText'} 
                  size={16} 
                  className="text-muted-foreground" 
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file?.size)} • {new Date(file?.uploadedAt)?.toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {uploadProgress?.[file?.id] !== undefined && (
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-smooth"
                        style={{ width: `${uploadProgress?.[file?.id]}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {uploadProgress?.[file?.id]}%
                    </span>
                  </div>
                )}
                
                {file?.type?.startsWith('image/') && (
                  <button
                    onClick={() => window.open(file?.url)}
                    className="p-1 hover:bg-background rounded transition-smooth"
                  >
                    <Icon name="Eye" size={16} className="text-muted-foreground" />
                  </button>
                )}
                
                <button
                  onClick={() => removeFile(file?.id, category)}
                  className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-smooth"
                >
                  <Icon name="Trash2" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Tài liệu đính kèm
        </h3>
        <p className="text-muted-foreground mb-6">
          Tải lên các tài liệu bổ sung giúp ứng viên hiểu rõ hơn về công việc và công ty.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FileUploadArea
          category="attachments"
          title="Job Specification Documents"
          description={allowedTypes?.documents?.description}
          icon="FileText"
          accept={allowedTypes?.documents?.types?.join(',')}
        />

        <FileUploadArea
          category="companyMaterials"
          title="Company Materials"
          description="Brochure công ty, hình ảnh văn phòng..."
          icon="Building"
          accept={[...allowedTypes?.documents?.types, ...allowedTypes?.images?.types]?.join(',')}
        />
      </div>
      {/* Upload Guidelines */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2 text-yellow-600" />
          Hướng dẫn tải file:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Job Specification:</strong> Mô tả chi tiết kỹ thuật, yêu cầu cụ thể của vị trí</li>
          <li>• <strong>Company Materials:</strong> Giới thiệu công ty, văn hóa, môi trường làm việc</li>
          <li>• File tải lên sẽ được bảo mật và chỉ hiển thị với ứng viên quan tâm</li>
          <li>• Nên tải lên file PDF để đảm bảo định dạng hiển thị đúng trên mọi thiết bị</li>
        </ul>
      </div>
      {/* Storage Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Tóm tắt file đính kèm:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Job Specifications:</strong> {data?.attachments?.length || 0} file
            {data?.attachments?.length > 0 && (
              <div className="text-xs mt-1">
                Tổng dung lượng: {formatFileSize(
                  data?.attachments?.reduce((total, file) => total + file?.size, 0)
                )}
              </div>
            )}
          </div>
          <div>
            <strong>Company Materials:</strong> {data?.companyMaterials?.length || 0} file
            {data?.companyMaterials?.length > 0 && (
              <div className="text-xs mt-1">
                Tổng dung lượng: {formatFileSize(
                  data?.companyMaterials?.reduce((total, file) => total + file?.size, 0)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;