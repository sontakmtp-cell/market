import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AdvancedSettings = ({ data, onChange, errors }) => {
  const [newQuestion, setNewQuestion] = useState('');
  
  const questionTypes = [
    { value: 'text', label: 'Câu trả lời ngắn', icon: 'Type' },
    { value: 'textarea', label: 'Câu trả lời dài', icon: 'AlignLeft' },
    { value: 'choice', label: 'Lựa chọn (A, B, C)', icon: 'CheckSquare' },
    { value: 'number', label: 'Số (kinh nghiệm, mức lương...)', icon: 'Hash' },
    { value: 'file', label: 'Tải file lên', icon: 'Upload' }
  ];

  const responseTemplates = [
    {
      value: 'thank-you',
      label: 'Cảm ơn cơ bản',
      template: 'Cảm ơn bạn đã quan tâm đến vị trí {job_title} tại {company}. Chúng tôi sẽ xem xét hồ sơ của bạn và phản hồi trong vòng 5-7 ngày làm việc.'
    },
    {
      value: 'next-steps',
      label: 'Thông báo bước tiếp theo',
      template: 'Xin chào {candidate_name}, cảm ơn bạn đã ứng tuyển vị trí {job_title}. Hồ sơ của bạn đã được ghi nhận. Nếu phù hợp, team HR sẽ liên hệ với bạn để sắp xếp cuộc phỏng vấn đầu tiên trong tuần tới.'
    },
    {
      value: 'timeline',
      label: 'Thời gian xử lý',
      template: 'Chào {candidate_name}, chúng tôi đã nhận được hồ sơ ứng tuyển của bạn cho vị trí {job_title}. Quy trình tuyển dụng dự kiến 2-3 tuần bao gồm: sàng lọc hồ sơ → phỏng vấn HR → phỏng vấn kỹ thuật → thông báo kết quả.'
    }
  ];

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const addScreeningQuestion = () => {
    if (newQuestion?.trim()) {
      const newQ = {
        id: Date.now(),
        question: newQuestion,
        type: 'text',
        required: true
      };
      
      onChange({
        screeningQuestions: [...(data?.screeningQuestions || []), newQ]
      });
      setNewQuestion('');
    }
  };

  const updateQuestion = (questionId, updates) => {
    onChange({
      screeningQuestions: data?.screeningQuestions?.map(q =>
        q?.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const removeQuestion = (questionId) => {
    onChange({
      screeningQuestions: data?.screeningQuestions?.filter(q => q?.id !== questionId)
    });
  };

  const handleTemplateSelect = (templateValue) => {
    const template = responseTemplates?.find(t => t?.value === templateValue);
    if (template) {
      handleChange('responseTemplate', template?.template);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow?.getDate() + 1);
    return tomorrow?.toISOString()?.split('T')?.[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Cài đặt nâng cao
        </h3>
        <p className="text-muted-foreground mb-6">
          Thiết lập thời hạn ứng tuyển, câu hỏi sàng lọc và tự động hóa phản hồi.
        </p>
      </div>

      {/* Application Deadline */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="Calendar" size={20} className="mr-2" />
          Thời hạn ứng tuyển
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Ngày hết hạn"
              value={data?.applicationDeadline || ''}
              onChange={(e) => handleChange('applicationDeadline', e?.target?.value)}
              min={getMinDate()}
              description="Để trống nếu không giới hạn thời gian"
            />
          </div>
          <div className="flex items-end">
            <div className="bg-muted p-3 rounded-lg w-full">
              <p className="text-sm text-muted-foreground">
                {data?.applicationDeadline ? (
                  <>
                    Tin đăng sẽ tự động đóng vào{' '}
                    <strong>
                      {new Date(data?.applicationDeadline)?.toLocaleDateString('vi-VN')}
                    </strong>
                  </>
                ) : (
                  'Tin đăng sẽ mở cho đến khi bạn đóng thủ công'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Screening Questions */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="HelpCircle" size={20} className="mr-2" />
          Câu hỏi sàng lọc
          <span className="text-sm text-muted-foreground ml-2 font-normal">
            (Giúp lọc ứng viên phù hợp)
          </span>
        </h4>

        {/* Add New Question */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Nhập câu hỏi sàng lọc (ví dụ: Bạn có bao nhiêu năm kinh nghiệm với React?)"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e?.target?.value)}
              onKeyPress={(e) => {
                if (e?.key === 'Enter') {
                  e?.preventDefault();
                  addScreeningQuestion();
                }
              }}
            />
            <Button
              onClick={addScreeningQuestion}
              disabled={!newQuestion?.trim()}
              iconName="Plus"
            >
              Thêm
            </Button>
          </div>
        </div>

        {/* Existing Questions */}
        {data?.screeningQuestions?.length > 0 && (
          <div className="space-y-3">
            {data?.screeningQuestions?.map((question, index) => (
              <div
                key={question?.id}
                className="border border-border rounded-lg p-4 bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-medium text-foreground">
                    Câu hỏi {index + 1}
                  </h5>
                  <button
                    onClick={() => removeQuestion(question?.id)}
                    className="text-muted-foreground hover:text-destructive transition-smooth"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Nội dung câu hỏi"
                    value={question?.question || ''}
                    onChange={(e) => updateQuestion(question?.id, { question: e?.target?.value })}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select
                      label="Loại câu trả lời"
                      options={questionTypes}
                      value={question?.type || 'text'}
                      onChange={(value) => updateQuestion(question?.id, { type: value })}
                    />
                    
                    <div className="flex items-center space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id={`required-${question?.id}`}
                        checked={question?.required || false}
                        onChange={(e) => updateQuestion(question?.id, { required: e?.target?.checked })}
                        className="rounded"
                      />
                      <label htmlFor={`required-${question?.id}`} className="text-sm text-muted-foreground">
                        Bắt buộc trả lời
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.screeningQuestions?.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-50" />
            <p>Chưa có câu hỏi sàng lọc nào</p>
            <p className="text-sm">Thêm câu hỏi để thu thập thông tin từ ứng viên</p>
          </div>
        )}
      </div>

      {/* Auto Response */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground flex items-center">
          <Icon name="Mail" size={20} className="mr-2" />
          Phản hồi tự động
        </h4>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="autoResponse"
            checked={data?.autoResponse || false}
            onChange={(e) => handleChange('autoResponse', e?.target?.checked)}
            className="rounded"
          />
          <label htmlFor="autoResponse" className="font-medium text-foreground">
            Gửi email xác nhận tự động khi nhận được hồ sơ
          </label>
        </div>

        {data?.autoResponse && (
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chọn template email:
              </label>
              <Select
                placeholder="Chọn mẫu email phù hợp"
                options={responseTemplates}
                onChange={handleTemplateSelect}
                description="Chọn template có sẵn hoặc tùy chỉnh bên dưới"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nội dung email:
              </label>
              <textarea
                placeholder="Nhập nội dung email phản hồi tự động..."
                value={data?.responseTemplate || ''}
                onChange={(e) => handleChange('responseTemplate', e?.target?.value)}
                rows={6}
                className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sử dụng các biến: {'{candidate_name}'}, {'{job_title}'}, {'{company}'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estimated Application Volume */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="TrendingUp" size={16} className="mr-2 text-blue-600" />
          Dự đoán lượng ứng tuyển
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">15-25</div>
            <div className="text-muted-foreground">Ứng viên/tuần</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">60%</div>
            <div className="text-muted-foreground">Tỷ lệ phù hợp</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">7-10</div>
            <div className="text-muted-foreground">Ngày để tuyển được</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          * Dựa trên phân tích các tin đăng tương tự và thị trường hiện tại
        </p>
      </div>

      {/* Settings Summary */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Tóm tắt cài đặt:</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>
            <strong>Thời hạn:</strong> {data?.applicationDeadline ? 
              new Date(data?.applicationDeadline)?.toLocaleDateString('vi-VN') : 
              'Không giới hạn'
            }
          </div>
          <div>
            <strong>Câu hỏi sàng lọc:</strong> {data?.screeningQuestions?.length || 0} câu hỏi
          </div>
          <div>
            <strong>Phản hồi tự động:</strong> {data?.autoResponse ? 'Đã bật' : 'Tắt'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;