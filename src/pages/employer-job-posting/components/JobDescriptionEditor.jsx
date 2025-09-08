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
    },
    {
      value: 'mechanical-design-engineer',
      label: 'Kỹ sư thiết kế máy',
      description: 'Template cho vị trí kỹ sư thiết kế cơ khí',
      template: {
        description: 'Chúng tôi đang tìm kiếm một Kỹ sư thiết kế máy có kinh nghiệm để tham gia vào việc phát triển và cải tiến các sản phẩm cơ khí. Ứng viên sẽ làm việc trong môi trường năng động và có cơ hội phát triển nghề nghiệp trong lĩnh vực kỹ thuật cơ khí.',
        responsibilities: '• Thiết kế và phát triển các bộ phận máy móc, thiết bị cơ khí\n• Tạo bản vẽ kỹ thuật 2D và mô hình 3D\n• Phân tích và tính toán kết cấu, chọn vật liệu phù hợp\n• Kiểm tra và đánh giá tính khả thi của thiết kế\n• Hỗ trợ quá trình sản xuất và giải quyết các vấn đề kỹ thuật\n• Cải tiến và tối ưu hóa thiết kế hiện có\n• Phối hợp với các bộ phận khác trong dự án',
        requirements: '• Tốt nghiệp Đại học chuyên ngành Cơ khí, Cơ điện tử hoặc tương đương\n• Tối thiểu 2-3 năm kinh nghiệm thiết kế cơ khí\n• Thành thạo phần mềm CAD (AutoCAD, SolidWorks, Inventor)\n• Hiểu biết về vật liệu kỹ thuật và quy trình chế tạo\n• Có kiến thức về tiêu chuẩn kỹ thuật và quy định an toàn\n• Kỹ năng giải quyết vấn đề và tư duy logic tốt\n• Có thể đọc hiểu bản vẽ kỹ thuật và tài liệu tiếng Anh'
      }
    },
    {
      value: 'assembly-maintenance-technician',
      label: 'Nhân viên lắp ráp bảo trì máy',
      description: 'Template cho vị trí kỹ thuật viên lắp ráp và bảo trì',
      template: {
        description: 'Chúng tôi cần tuyển Nhân viên lắp ráp bảo trì máy có kỹ năng và kinh nghiệm để đảm bảo máy móc thiết bị hoạt động ổn định và hiệu quả. Đây là cơ hội tốt để phát triển kỹ năng chuyên môn trong môi trường sản xuất hiện đại.',
        responsibilities: '• Lắp ráp máy móc, thiết bị theo bản vẽ kỹ thuật\n• Thực hiện bảo trì định kỳ và sửa chữa máy móc\n• Kiểm tra, đánh giá tình trạng hoạt động của thiết bị\n• Thay thế linh kiện, phụ tùng khi cần thiết\n• Ghi chép báo cáo tình trạng máy móc và công việc thực hiện\n• Tuân thủ quy trình an toàn lao động\n• Hỗ trợ khắc phục sự cố đột xuất\n• Tham gia đào tạo và nâng cao kỹ năng nghề nghiệp',
        requirements: '• Tốt nghiệp Trung cấp/Cao đẳng Cơ khí, Cơ điện tử hoặc có kinh nghiệm tương đương\n• Tối thiểu 1-2 năm kinh nghiệm lắp ráp và bảo trì máy móc\n• Có kỹ năng sử dụng dụng cụ, thiết bị đo lường cơ bản\n• Đọc hiểu được bản vẽ kỹ thuật và sơ đồ mạch\n• Có tinh thần trách nhiệm và cẩn thận trong công việc\n• Khả năng làm việc ca kíp và chịu được áp lực\n• Có chứng chỉ an toàn lao động là một lợi thế\n• Sức khỏe tốt, không có các bệnh nghề nghiệp'
      }
    },
    {
      value: 'welder',
      label: 'Thợ hàn',
      description: 'Template cho vị trí thợ hàn chuyên nghiệp',
      template: {
        description: 'Chúng tôi đang tuyển dụng Thợ hàn có tay nghề cao để tham gia vào các dự án sản xuất và gia công kim loại. Ứng viên sẽ được làm việc với các thiết bị hiện đại và có cơ hội phát triển kỹ năng trong môi trường chuyên nghiệp.',
        responsibilities: '• Thực hiện các công việc hàn theo bản vẽ kỹ thuật\n• Hàn các loại vật liệu: thép carbon, thép không gỉ, nhôm\n• Chuẩn bị mặt bích, làm sạch và xử lý bề mặt trước khi hàn\n• Kiểm tra chất lượng đường hàn và khắc phục các khuyết tật\n• Bảo dưỡng và vệ sinh thiết bị hàn\n• Tuân thủ nghiêm ngặt các quy định về an toàn lao động\n• Báo cáo tiến độ công việc và các vấn đề phát sinh\n• Tham gia đào tạo nâng cao kỹ năng hàn',
        requirements: '• Tốt nghiệp Trung cấp nghề Hàn hoặc có kinh nghiệm tương đương\n• Tối thiểu 2 năm kinh nghiệm hàn trong môi trường công nghiệp\n• Thành thạo các phương pháp hàn: GMAW, SMAW, TIG, MAG\n• Có chứng chỉ thợ hàn theo tiêu chuẩn quốc gia/quốc tế\n• Đọc hiểu được bản vẽ hàn và ký hiệu hàn\n• Có kỹ năng sử dụng các thiết bị đo lường cơ bản\n• Sức khỏe tốt, thị lực bình thường\n• Có tinh thần trách nhiệm và tác phong công nghiệp tốt\n• Ưu tiên ứng viên có kinh nghiệm hàn kết cấu thép, đường ống'
      }
    },
    {
      value: 'cnc-machinist',
      label: 'Thợ đứng máy gia công cơ',
      description: 'Template cho vị trí vận hành máy gia công cơ khí',
      template: {
        description: 'Chúng tôi cần tuyển Thợ đứng máy gia công cơ có kinh nghiệm để vận hành các máy gia công trong sản xuất. Ứng viên sẽ làm việc với các máy móc hiện đại và có cơ hội phát triển kỹ năng chuyên môn cao.',
        responsibilities: '• Vận hành máy tiện, máy phay, máy mài và các máy gia công khác\n• Cài đặt thông số gia công theo bản vẽ kỹ thuật\n• Kiểm tra kích thước và chất lượng sản phẩm gia công\n• Thay dao cắt và điều chỉnh tốc độ cắt phù hợp\n• Bảo dưỡng và vệ sinh máy móc thiết bị\n• Ghi chép nhật ký vận hành và báo cáo sự cố\n• Tuân thủ quy trình an toàn lao động\n• Đảm bảo năng suất và chất lượng theo yêu cầu',
        requirements: '• Tốt nghiệp Trung cấp/Cao đẳng Cơ khí hoặc có kinh nghiệm tương đương\n• Tối thiểu 1-3 năm kinh nghiệm vận hành máy gia công cơ khí\n• Thành thạo sử dụng các dụng cụ đo lường: thước cặp, panme, đồng hồ so\n• Đọc hiểu được bản vẽ kỹ thuật và dung sai gia công\n• Có kiến thức về vật liệu và dao cắt\n• Khả năng tính toán tốc độ cắt và lượng chạy dao\n• Cẩn thận, tỉ mỉ và có tinh thần trách nhiệm cao\n• Sức khỏe tốt, có thể làm việc ca kíp\n• Ưu tiên ứng viên có kinh nghiệm với máy CNC'
      }
    },
    {
      value: 'cnc-programmer',
      label: 'Lập trình CNC',
      description: 'Template cho vị trí lập trình viên CNC',
      template: {
        description: 'Chúng tôi đang tìm kiếm Lập trình viên CNC có kỹ năng và kinh nghiệm để tham gia vào việc lập trình và tối ưu hóa quy trình gia công. Đây là cơ hội để làm việc với công nghệ tiên tiến và phát triển chuyên môn trong lĩnh vực gia công CNC.',
        responsibilities: '• Lập trình CNC cho máy tiện, máy phay và máy gia công phức tạp\n• Phân tích bản vẽ kỹ thuật và lựa chọn phương pháp gia công tối ưu\n• Tạo và chỉnh sửa chương trình G-code, M-code\n• Mô phỏng và kiểm tra chương trình CNC trước khi gia công thực tế\n• Tối ưu hóa thời gian gia công và chất lượng sản phẩm\n• Hướng dẫn thợ máy vận hành và khắc phục sự cố\n• Cập nhật và cải tiến quy trình gia công\n• Tạo tài liệu kỹ thuật và hướng dẫn vận hành',
        requirements: '• Tốt nghiệp Cao đẳng/Đại học Cơ khí, Cơ điện tử hoặc tương đương\n• Tối thiểu 2-4 năm kinh nghiệm lập trình CNC\n• Thành thạo phần mềm CAM: Mastercam, PowerMill, EdgeCAM hoặc tương đương\n• Hiểu biết sâu về G-code, M-code và các hệ điều khiển CNC (Fanuc, Siemens, Mitsubishi)\n• Có kiến thức về dao cắt, vật liệu và thông số gia công\n• Kỹ năng đọc hiểu bản vẽ kỹ thuật và dung sai chính xác\n• Tư duy logic tốt và khả năng giải quyết vấn đề phức tạp\n• Kỹ năng giao tiếp và làm việc nhóm hiệu quả\n• Ưu tiên ứng viên có kinh nghiệm với máy 5 trục và gia công phức tạp'
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