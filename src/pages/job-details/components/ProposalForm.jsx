import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProposalForm = ({ onSubmitProposal }) => {
  const [formData, setFormData] = useState({
    bidAmount: '',
    timeline: '',
    coverLetter: '',
    milestones: [{ title: '', amount: '', deadline: '' }],
    portfolioSamples: []
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timelineOptions = [
    { value: '1-week', label: '1 tuần' },
    { value: '2-weeks', label: '2 tuần' },
    { value: '1-month', label: '1 tháng' },
    { value: '2-months', label: '2 tháng' },
    { value: '3-months', label: '3 tháng' },
    { value: 'custom', label: 'Tùy chỉnh' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...formData?.milestones];
    newMilestones[index][field] = value;
    setFormData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev?.milestones, { title: '', amount: '', deadline: '' }]
    }));
  };

  const removeMilestone = (index) => {
    if (formData?.milestones?.length > 1) {
      const newMilestones = formData?.milestones?.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        milestones: newMilestones
      }));
    }
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(),
      name: file?.name,
      size: (file?.size / 1024 / 1024)?.toFixed(2) + ' MB',
      type: file?.type,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      portfolioSamples: [...prev?.portfolioSamples, ...newFiles]
    }));
  };

  const removeFile = (fileId) => {
    setFormData(prev => ({
      ...prev,
      portfolioSamples: prev?.portfolioSamples?.filter(file => file?.id !== fileId)
    }));
  };

  const calculatePlatformFee = () => {
    const amount = parseFloat(formData?.bidAmount) || 0;
    return (amount * 0.05)?.toFixed(0); // 5% platform fee
  };

  const calculateNetAmount = () => {
    const amount = parseFloat(formData?.bidAmount) || 0;
    const fee = parseFloat(calculatePlatformFee());
    return (amount - fee)?.toFixed(0);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmitProposal(formData);
    } catch (error) {
      console.error('Error submitting proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Send" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Gửi đề xuất</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Thông tin giá cả</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Giá đề xuất (VNĐ)"
              type="number"
              placeholder="50,000,000"
              value={formData?.bidAmount}
              onChange={(e) => handleInputChange('bidAmount', e?.target?.value)}
              required
            />
            
            <Select
              label="Thời gian hoàn thành"
              options={timelineOptions}
              value={formData?.timeline}
              onChange={(value) => handleInputChange('timeline', value)}
              placeholder="Chọn thời gian"
              required
            />
          </div>

          {formData?.bidAmount && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá đề xuất:</span>
                  <span className="font-medium text-foreground">
                    {parseInt(formData?.bidAmount)?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí nền tảng (5%):</span>
                  <span className="text-error">
                    -{parseInt(calculatePlatformFee())?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-medium text-foreground">Số tiền nhận được:</span>
                  <span className="font-semibold text-success">
                    {parseInt(calculateNetAmount())?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Milestones Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Mốc thanh toán</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMilestone}
              iconName="Plus"
              iconPosition="left"
            >
              Thêm mốc
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData?.milestones?.map((milestone, index) => (
              <div key={index} className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">
                    Mốc {index + 1}
                  </span>
                  {formData?.milestones?.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMilestone(index)}
                      iconName="X"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    label="Tên mốc"
                    placeholder="Ví dụ: Thiết kế ban đầu"
                    value={milestone?.title}
                    onChange={(e) => handleMilestoneChange(index, 'title', e?.target?.value)}
                  />
                  <Input
                    label="Số tiền (VNĐ)"
                    type="number"
                    placeholder="20,000,000"
                    value={milestone?.amount}
                    onChange={(e) => handleMilestoneChange(index, 'amount', e?.target?.value)}
                  />
                  <Input
                    label="Hạn hoàn thành"
                    type="date"
                    value={milestone?.deadline}
                    onChange={(e) => handleMilestoneChange(index, 'deadline', e?.target?.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Thư giới thiệu</h3>
          <textarea
            className="w-full min-h-[120px] p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder={`Xin chào,\n\nTôi rất quan tâm đến dự án của bạn và tin rằng có thể mang lại giá trị tốt nhất. Với kinh nghiệm [X năm] trong lĩnh vực [chuyên môn], tôi đã thực hiện thành công nhiều dự án tương tự.\n\nTôi sẽ:\n- [Điểm mạnh 1]\n- [Điểm mạnh 2]\n- [Điểm mạnh 3]\n\nRất mong được hợp tác cùng bạn!\n\nTrân trọng,\n[Tên của bạn]`}
            value={formData?.coverLetter}
            onChange={(e) => handleInputChange('coverLetter', e?.target?.value)}
            required
          />
        </div>

        {/* Portfolio Upload */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Mẫu portfolio</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              Kéo thả file vào đây hoặc{' '}
              <label className="text-primary cursor-pointer hover:underline">
                chọn file
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                  className="hidden"
                  onChange={(e) => handleFiles(e?.target?.files)}
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ: PDF, DOC, DOCX, JPG, PNG, DWG (tối đa 10MB mỗi file)
            </p>
          </div>

          {formData?.portfolioSamples?.length > 0 && (
            <div className="space-y-2">
              {formData?.portfolioSamples?.map((file) => (
                <div key={file?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="File" size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{file?.size}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file?.id)}
                    iconName="X"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="default"
            loading={isSubmitting}
            iconName="Send"
            iconPosition="left"
            className="flex-1"
          >
            Gửi đề xuất
          </Button>
          <Button
            type="button"
            variant="outline"
            iconName="Save"
            iconPosition="left"
          >
            Lưu nháp
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;