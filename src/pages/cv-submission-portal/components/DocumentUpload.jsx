import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DocumentUpload = ({ data, onChange, errors }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const fileTypes = {
    cv: {
      accept: '.pdf,.doc,.docx',
      maxSize: 5 * 1024 * 1024, // 5MB
      description: 'PDF, DOC, DOCX (tối đa 5MB)',
      required: true
    },
    coverLetter: {
      accept: '.pdf,.doc,.docx',
      maxSize: 5 * 1024 * 1024, // 5MB
      description: 'PDF, DOC, DOCX (tối đa 5MB)',
      required: false
    },
    portfolio: {
      accept: '.pdf,.zip,.rar',
      maxSize: 10 * 1024 * 1024, // 10MB
      description: 'PDF, ZIP, RAR (tối đa 10MB)',
      required: false
    },
    certificates: {
      accept: '.pdf,.jpg,.jpeg,.png',
      maxSize: 2 * 1024 * 1024, // 2MB per file
      description: 'PDF, JPG, PNG (tối đa 2MB mỗi file)',
      required: false,
      multiple: true
    }
  };

  const validateFile = (file, type) => {
    const config = fileTypes?.[type];
    
    // Check file type
    const fileExtension = '.' + file?.name?.split('.')?.pop()?.toLowerCase();
    const allowedTypes = config?.accept?.split(',');
    
    if (!allowedTypes?.includes(fileExtension)) {
      return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${config?.description}`;
    }
    
    // Check file size
    if (file?.size > config?.maxSize) {
      const maxSizeMB = config?.maxSize / (1024 * 1024);
      return `File quá lớn. Kích thước tối đa: ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const handleFileSelect = async (files, type) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const errors = [];

    for (const file of fileArray) {
      const error = validateFile(file, type);
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

    // Handle multiple files (certificates)
    if (fileTypes?.[type]?.multiple) {
      const existingFiles = data?.certificates || [];
      const newFiles = [];
      
      for (const file of validFiles) {
        const fileId = Date.now() + Math.random();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        const fileObj = {
          id: fileId,
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          uploadedAt: new Date()?.toISOString(),
          url: URL.createObjectURL(file)
        };

        newFiles?.push(fileObj);

        // Simulate upload progress
        simulateUpload(fileId);
      }

      onChange({
        certificates: [...existingFiles, ...newFiles]
      });
    } else {
      // Handle single file
      const file = validFiles?.[0];
      if (file) {
        const fileId = Date.now() + Math.random();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        const fileObj = {
          id: fileId,
          file,
          name: file?.name,
          size: file?.size,
          type: file?.type,
          uploadedAt: new Date()?.toISOString(),
          url: URL.createObjectURL(file)
        };

        onChange({ [type]: fileObj });
        simulateUpload(fileId);
      }
    }
  };

  const simulateUpload = (fileId) => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev?.[fileId] || 0;
        const newProgress = Math.min(currentProgress + 20, 100);
        
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(prev => {
              const { [fileId]: removed, ...rest } = prev;
              return rest;
            });
          }, 1000);
        }
        
        return { ...prev, [fileId]: newProgress };
      });
    }, 200);
  };

  const removeFile = (type, fileId = null) => {
    if (fileTypes?.[type]?.multiple) {
      const updatedFiles = data?.certificates?.filter(file => file?.id !== fileId);
      onChange({ certificates: updatedFiles });
    } else {
      onChange({ [type]: null });
    }
    
    // Remove from progress if still uploading
    if (fileId) {
      setUploadProgress(prev => {
        const { [fileId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e, type) => {
    e?.preventDefault();
    setDragOver(false);
    
    const files = e?.dataTransfer?.files;
    if (files) {
      handleFileSelect(files, type);
    }
  };

  const FileUploadArea = ({ type, title, description, icon, required = false }) => {
    const config = fileTypes?.[type];
    const currentFile = data?.[type];
    const currentFiles = type === 'certificates' ? data?.certificates || [] : null;
    const hasFiles = currentFile || (currentFiles && currentFiles?.length > 0);

    return (
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name={icon} size={18} className="mr-2" />
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </h4>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-smooth ${
            dragOver
              ? 'border-primary bg-primary/5' :'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, type)}
        >
          <Icon name="Upload" size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">
            Kéo thả file vào đây hoặc click để chọn
          </p>
          <p className="text-muted-foreground text-sm mb-4">
            {config?.description}
          </p>
          
          <input
            type="file"
            accept={config?.accept}
            multiple={config?.multiple}
            onChange={(e) => handleFileSelect(e?.target?.files, type)}
            className="hidden"
            id={`file-input-${type}`}
          />
          
          <Button
            variant="outline"
            onClick={() => document.getElementById(`file-input-${type}`)?.click()}
          >
            Chọn file
          </Button>
        </div>
        {/* Display uploaded files */}
        {hasFiles && (
          <div className="space-y-2">
            {type === 'certificates' ? (
              currentFiles?.map((file) => (
                <FileItem
                  key={file?.id}
                  file={file}
                  onRemove={() => removeFile(type, file?.id)}
                  progress={uploadProgress?.[file?.id]}
                />
              ))
            ) : currentFile ? (
              <FileItem
                file={currentFile}
                onRemove={() => removeFile(type)}
                progress={uploadProgress?.[currentFile?.id]}
              />
            ) : null}
          </div>
        )}
        {required && !hasFiles && errors?.[type] && (
          <p className="text-sm text-destructive">{errors?.[type]}</p>
        )}
      </div>
    );
  };

  const FileItem = ({ file, onRemove, progress }) => (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
        {progress !== undefined && progress < 100 && (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-background rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-smooth"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progress}%</span>
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
          onClick={onRemove}
          className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded transition-smooth"
        >
          <Icon name="Trash2" size={16} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Tài liệu hồ sơ
        </h3>
        <p className="text-muted-foreground">
          Tải lên CV và các tài liệu liên quan để hoàn thiện hồ sơ ứng tuyển.
        </p>
      </div>

      <div className="space-y-8">
        <FileUploadArea
          type="cv"
          title="CV/Resume"
          description="Tài liệu tóm tắt kinh nghiệm và kỹ năng của bạn"
          icon="FileText"
          required
        />

        <FileUploadArea
          type="coverLetter"
          title="Thư giới thiệu"
          description="Thư giới thiệu bản thân và lý do ứng tuyển"
          icon="Mail"
        />

        <FileUploadArea
          type="portfolio"
          title="Portfolio"
          description="Tổng hợp các dự án và sản phẩm đã thực hiện"
          icon="Briefcase"
        />

        <FileUploadArea
          type="certificates"
          title="Chứng chỉ & Bằng cấp"
          description="Các chứng chỉ chuyên môn, bằng cấp liên quan"
          icon="Award"
        />

        {/* Upload Guidelines */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2 flex items-center">
            <Icon name="Info" size={16} className="mr-2 text-yellow-600" />
            Lưu ý khi tải file:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>CV/Resume:</strong> Bắt buộc, nên có định dạng PDF để đảm bảo hiển thị đúng</li>
            <li>• <strong>Thư giới thiệu:</strong> Giúp tăng cơ hội được chú ý, nên viết cá nhân hóa cho từng vị trí</li>
            <li>• <strong>Portfolio:</strong> Rất quan trọng với vị trí kỹ thuật, thiết kế</li>
            <li>• <strong>Chứng chỉ:</strong> Chỉ tải lên chứng chỉ liên quan đến công việc</li>
            <li>• Tất cả file được mã hóa và bảo mật, chỉ nhà tuyển dụng mới có thể xem</li>
          </ul>
        </div>

        {/* Upload Summary */}
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Tóm tắt tài liệu:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Icon 
                name={data?.cv ? "CheckCircle" : "Circle"} 
                size={14} 
                className={data?.cv ? "text-success" : ""} 
              />
              <span>CV/Resume {data?.cv ? '✓' : '(bắt buộc)'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon 
                name={data?.coverLetter ? "CheckCircle" : "Circle"} 
                size={14} 
                className={data?.coverLetter ? "text-success" : ""} 
              />
              <span>Thư giới thiệu {data?.coverLetter ? '✓' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon 
                name={data?.portfolio ? "CheckCircle" : "Circle"} 
                size={14} 
                className={data?.portfolio ? "text-success" : ""} 
              />
              <span>Portfolio {data?.portfolio ? '✓' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon 
                name={data?.certificates?.length > 0 ? "CheckCircle" : "Circle"} 
                size={14} 
                className={data?.certificates?.length > 0 ? "text-success" : ""} 
              />
              <span>Chứng chỉ ({data?.certificates?.length || 0} file)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;