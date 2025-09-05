import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const JobDescriptionEditor = ({ data, onChange, errors }) => {
  const [activeEditor, setActiveEditor] = useState('description');

  const jobTemplates = [
    {
      value: 'software-engineer',
      label: 'Kỹ sư Phần mềm',
      description: 'Template cho vị trí lập trình viên',
      template: {
        description: 'Chúng tôi đang tìm kiếm một Kỹ sư Phần mềm tài năng để tham gia vào đội ngũ phát triển sản phẩm...',
        responsibilities: '• Phát triển và duy trì các ứng dụng web\n• Tham gia vào quá trình thiết kế hệ thống\n• Code review và mentoring các thành viên junior\n• Tối ưu hóa performance và bảo mật ứng dụng',
        requirements: '• Tối thiểu 3 năm kinh nghiệm phát triển phần mềm\n• Thành thạo JavaScript, React, Node.js\n• Có kinh nghiệm với database (PostgreSQL, MongoDB)\n• Hiểu biết về DevOps và CI/CD\n• Kỹ năng giải quyết vấn đề tốt'
      }
    },
    {
      value: 'frontend-developer',
      label: 'Frontend Developer',
      description: 'Template cho vị trí phát triển giao diện',
      template: {
        description: 'Chúng tôi cần một Frontend Developer có kinh nghiệm để xây dựng giao diện người dùng hiện đại...',
        responsibilities: '• Phát triển giao diện responsive cho web và mobile\n• Tối ưu hóa performance và UX\n• Tích hợp với backend APIs\n• Đảm bảo tính tương thích trên các trình duyệt',
        requirements: '• 2+ năm kinh nghiệm Frontend development\n• Thành thạo React, Vue.js hoặc Angular\n• Hiểu biết sâu về HTML, CSS, JavaScript\n• Có kinh nghiệm với responsive design\n• Biết sử dụng Git và công cụ build modern'
      }
    },
    {
      value: 'ui-ux-designer',
      label: 'UI/UX Designer',
      description: 'Template cho vị trí thiết kế giao diện',
      template: {
        description: 'Chúng tôi đang tìm kiếm một UI/UX Designer sáng tạo để thiết kế trải nghiệm người dùng tuyệt vời...',
        responsibilities: '• Nghiên cứu và phân tích user behavior\n• Thiết kế wireframes, prototypes và UI mockups\n• Tạo design system và component library\n• Hợp tác chặt chẽ với team development',
        requirements: '• Tối thiểu 2 năm kinh nghiệm UI/UX Design\n• Thành thạo Figma, Sketch, Adobe Creative Suite\n• Hiểu biết về user research và usability testing\n• Có portfolio thể hiện các dự án thực tế\n• Kỹ năng giao tiếp và present ý tưởng tốt'
      }
    }
  ];

  const handleTemplateSelect = (templateValue) => {
    const template = jobTemplates?.find(t => t?.value === templateValue);
    if (template) {
      onChange({
        templateType: templateValue,
        description: template?.template?.description,
        responsibilities: template?.template?.responsibilities,
        requirements: template?.template?.requirements
      });
    }
  };

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  const formatText = (text, format) => {
    const textArea = document.querySelector(`[name="${activeEditor}"]`);
    if (!textArea) return;

    const start = textArea?.selectionStart;
    const end = textArea?.selectionEnd;
    const selectedText = text?.substring(start, end);

    if (selectedText) {
      let formattedText = selectedText;
      
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'bullet':
          formattedText = selectedText?.split('\n')?.map(line => 
            line?.trim() ? `• ${line}` : line
          )?.join('\n');
          break;
        case 'number':
          formattedText = selectedText?.split('\n')?.map((line, index) => 
            line?.trim() ? `${index + 1}. ${line}` : line
          )?.join('\n');
          break;
      }

      const newText = text?.substring(0, start) + formattedText + text?.substring(end);
      handleChange(activeEditor, newText);
    }
  };

  const editorTabs = [
    {
      key: 'description',
      label: 'Mô tả công việc',
      placeholder: 'Viết mô tả chi tiết về vị trí công việc, môi trường làm việc, và những gì ứng viên sẽ làm...',
      icon: 'FileText'
    },
    {
      key: 'responsibilities',
      label: 'Trách nhiệm công việc',
      placeholder: 'Liệt kê các trách nhiệm chính của vị trí:\n• Phát triển và bảo trì ứng dụng\n• Tham gia review code\n• Hỗ trợ team members...',
      icon: 'CheckSquare'
    },
    {
      key: 'requirements',
      label: 'Yêu cầu ứng viên',
      placeholder: 'Mô tả yêu cầu về kỹ năng, kinh nghiệm và tính cách:\n• Kinh nghiệm 3+ năm\n• Thành thạo React, Node.js\n• Kỹ năng làm việc nhóm tốt...',
      icon: 'User'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Mô tả chi tiết công việc
        </h3>
        <p className="text-muted-foreground mb-6">
          Tạo mô tả công việc chi tiết và hấp dẫn để thu hút ứng viên phù hợp.
        </p>
      </div>

      {/* Template Selector */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-3">Sử dụng template có sẵn:</h4>
        <Select
          placeholder="Chọn template phù hợp với vị trí của bạn"
          options={jobTemplates}
          value={data?.templateType || ''}
          onChange={handleTemplateSelect}
          description="Template sẽ tự động điền nội dung mẫu, bạn có thể chỉnh sửa theo nhu cầu"
        />
      </div>

      {/* Editor Tabs */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="flex border-b border-border bg-muted">
          {editorTabs?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setActiveEditor(tab?.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-smooth flex items-center justify-center space-x-2 ${
                activeEditor === tab?.key
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Editor Toolbar */}
        <div className="p-3 border-b border-border bg-card">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText(data?.[activeEditor] || '', 'bold')}
            >
              <Icon name="Bold" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText(data?.[activeEditor] || '', 'italic')}
            >
              <Icon name="Italic" size={16} />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText(data?.[activeEditor] || '', 'bullet')}
            >
              <Icon name="List" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText(data?.[activeEditor] || '', 'number')}
            >
              <Icon name="ListOrdered" size={16} />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-4">
          {editorTabs?.map((tab) => (
            <div
              key={tab?.key}
              className={activeEditor === tab?.key ? 'block' : 'hidden'}
            >
              <textarea
                name={tab?.key}
                placeholder={tab?.placeholder}
                value={data?.[tab?.key] || ''}
                onChange={(e) => handleChange(tab?.key, e?.target?.value)}
                rows={12}
                className={`w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors?.[tab?.key] ? 'border-destructive' : ''
                }`}
              />
              {errors?.[tab?.key] && (
                <p className="text-sm text-destructive mt-1">{errors?.[tab?.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h4 className="font-medium text-foreground mb-2 flex items-center">
          <Icon name="Lightbulb" size={16} className="mr-2 text-blue-600" />
          Mẹo viết job description hiệu quả:
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Sử dụng ngôn ngữ tích cực và thu hút</li>
          <li>• Chia nhỏ thông tin thành các điểm cụ thể</li>
          <li>• Tránh sử dụng quá nhiều thuật ngữ kỹ thuật</li>
          <li>• Nhấn mạnh những điểm nổi bật của công ty</li>
          <li>• Đề cập đến cơ hội phát triển và học hỏi</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescriptionEditor;