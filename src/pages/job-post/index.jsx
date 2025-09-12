import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FileUpload from '../../components/ui/FileUpload';
import { saveProject, getProjectById } from '../../utils/dataStore';
import { useSupabase } from '../../contexts/SupabaseContext';

const JobPost = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get project ID from URL for editing
  const { user } = useSupabase(); // Get current user
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    skills: [],
    budgetMin: '',
    budgetMax: '',
    currency: 'VND',
    duration: '',
    deadline: '',
    isUrgent: false,
    location: '',
    attachments: [],
    referenceDocuments: [],
    objectives: [''],
    technicalRequirements: [{ category: '', items: [''] }],
    deliverables: [{ title: '', description: '', deadline: '' }],
    displayType: 'standard', // 'standard' or 'vip'
    client: {
      name: 'Khách hàng',
      company: '',
      rating: 5,
      reviewCount: 0,
      location: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [currentSkill, setCurrentSkill] = useState('');

  // Load project data for editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchProject = async () => {
        try {
          const projectData = await getProjectById(id);
          if (projectData) {
            // Map database fields to form data structure
            setFormData({
              title: projectData.title || '',
              shortDescription: projectData.shortDescription || '',
              fullDescription: projectData.fullDescription || '',
              category: projectData.category || '',
              skills: Array.isArray(projectData.skills) ? projectData.skills : [],
              budgetMin: projectData.budgetMin?.toString() || '',
              budgetMax: projectData.budgetMax?.toString() || '',
              currency: projectData.currency || 'VND',
              duration: projectData.duration || '',
              deadline: projectData.deadline || '',
              isUrgent: projectData.isUrgent || false,
              location: projectData.location || '',
              attachments: Array.isArray(projectData.attachments) ? projectData.attachments : [],
              referenceDocuments: Array.isArray(projectData.attachments) ? projectData.attachments : [],
              objectives: Array.isArray(projectData.objectives) ? projectData.objectives : [''],
              technicalRequirements: Array.isArray(projectData.technicalRequirements) ? projectData.technicalRequirements : [{ category: '', items: [''] }],
              deliverables: Array.isArray(projectData.deliverables) ? projectData.deliverables : [{ title: '', description: '', deadline: '' }],
              displayType: projectData.displayType || 'standard',
              client: projectData.client || {
                name: 'Khách hàng',
                company: '',
                rating: 5,
                reviewCount: 0,
                location: ''
              }
            });
          }
        } catch (error) {
          console.error('Error fetching project for editing:', error);
          alert('Không thể tải dữ liệu dự án. Vui lòng thử lại.');
          navigate('/job-marketplace');
        }
      };
      fetchProject();
    }
  }, [id, navigate]);

  const categories = [
    { value: 'structural', label: 'Kết cấu xây dựng' },
    { value: 'mechanical', label: 'Cơ khí' },
    { value: 'electronic', label: 'Điện tử' },
    { value: 'crane', label: 'Cần cẩu' },
    { value: 'architecture', label: 'Kiến trúc' },
    { value: 'other', label: 'Khác' }
  ];

  const currencies = [
    { value: 'VND', label: 'VND' },
    { value: 'USD', label: 'USD' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addTechnicalRequirement = () => {
    setFormData(prev => ({
      ...prev,
      technicalRequirements: [...prev.technicalRequirements, { category: '', items: [''] }]
    }));
  };

  const updateTechnicalRequirement = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      technicalRequirements: prev.technicalRequirements.map((req, i) => 
        i === index ? { ...req, [field]: value } : req
      )
    }));
  };

  const addTechnicalItem = (reqIndex) => {
    setFormData(prev => ({
      ...prev,
      technicalRequirements: prev.technicalRequirements.map((req, i) => 
        i === reqIndex ? { ...req, items: [...req.items, ''] } : req
      )
    }));
  };

  const updateTechnicalItem = (reqIndex, itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      technicalRequirements: prev.technicalRequirements.map((req, i) => 
        i === reqIndex ? {
          ...req,
          items: req.items.map((item, j) => j === itemIndex ? value : item)
        } : req
      )
    }));
  };

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, { title: '', description: '', deadline: '' }]
    }));
  };

  const updateDeliverable = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((del, i) => 
        i === index ? { ...del, [field]: value } : del
      )
    }));
  };

  const removeDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleFilesUploaded = (uploadedFiles) => {
    setFormData(prev => ({
      ...prev,
      referenceDocuments: [...prev.referenceDocuments, ...uploadedFiles]
    }));
  };

  const removeDocument = (docId) => {
    setFormData(prev => ({
      ...prev,
      referenceDocuments: prev.referenceDocuments.filter(doc => doc.id !== docId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề dự án là bắt buộc';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Mô tả ngắn là bắt buộc';
    }

    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Mô tả chi tiết là bắt buộc';
    }

    if (!formData.category) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    const budgetMin = parseFloat(formData.budgetMin);
    const budgetMax = parseFloat(formData.budgetMax);

    if (!formData.budgetMin || budgetMin <= 0) {
      newErrors.budgetMin = 'Ngân sách tối thiểu phải lớn hơn 0';
    }

    if (!formData.budgetMax || budgetMax <= 0) {
      newErrors.budgetMax = 'Ngân sách tối đa phải lớn hơn 0';
    }

    if (budgetMin && budgetMax && budgetMin > budgetMax) {
      newErrors.budgetMin = 'Ngân sách tối thiểu không được lớn hơn ngân sách tối đa';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Hạn chót là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      alert('Bạn cần đăng nhập để đăng dự án. Vui lòng đăng nhập và thử lại.');
      navigate('/login');
      return;
    }

    // Handle VIP payment confirmation
    if (formData.displayType === 'vip' && !isEditMode) {
      const confirmPayment = window.confirm(
        `Bạn đã chọn đăng bài với giao diện VIP.\n\nPhí VIP: 10.000 VND\n\nLợi ích:\n- Hiệu ứng 3D tuyệt đẹp\n- Badge VIP nổi bật\n- Tăng tỷ lệ xem và ứng tuyển\n\nBạn có đồng ý thanh toán không?`
      );
      
      if (!confirmPayment) {
        return;
      }
    }

    try {
      // Clean up data before saving
      const cleanData = {
        ...formData,
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
        objectives: formData.objectives.filter(obj => obj.trim()),
        technicalRequirements: formData.technicalRequirements
          .filter(req => req.category.trim())
          .map(req => ({
            ...req,
            items: req.items.filter(item => item.trim())
          })),
        deliverables: formData.deliverables.filter(del => del.title.trim()),
        attachments: formData.referenceDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          size: doc.size,
          type: doc.type,
          url: doc.url || null, // Store the Supabase URL
          uploadedAt: doc.uploadedAt || new Date().toISOString()
        })),
        // Add VIP display metadata
        vipFeePaid: formData.displayType === 'vip' ? (!isEditMode ? 10000 : 0) : 0,
        vipActivatedAt: formData.displayType === 'vip' ? new Date().toISOString() : null
      };

      // If in edit mode, include the project ID
      if (isEditMode && id) {
        cleanData.id = id;
      }

      const savedProject = await saveProject(cleanData);
      if (savedProject?.id) {
        let message = isEditMode ? 'Dự án đã được cập nhật thành công!' : 'Dự án đã được đăng thành công!';
        
        if (formData.displayType === 'vip' && !isEditMode) {
          message += '\n\nBài đăng VIP của bạn đã được kích hoạt với hiệu ứng 3D đặc biệt!';
        }
        
        alert(message);
        navigate(`/job-details/${savedProject.id}`);
      } else {
        console.error('Project was not saved or missing id:', savedProject);
        alert('Không thể lưu dự án. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      
      // Handle specific error types
      if (error.message.includes('Authentication required')) {
        alert('Bạn cần đăng nhập để đăng dự án. Vui lòng đăng nhập và thử lại.');
        navigate('/login');
      } else if (error.message.includes('Row Level Security')) {
        alert('Lỗi quyền truy cập. Vui lòng đăng nhập lại và thử lại.');
        navigate('/login');
      } else {
        alert(`Có lỗi xảy ra khi lưu dự án: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? 'Chỉnh sửa dự án' : 'Đăng dự án mới'}
            </h1>
            <p className="text-gray-600">
              {isEditMode 
                ? 'Cập nhật thông tin dự án của bạn' 
                : 'Cung cấp thông tin chi tiết về dự án để thu hút các freelancer phù hợp'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Tiêu đề dự án *"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ví dụ: Thiết kế hệ thống điều hòa cho tòa nhà 20 tầng"
                    error={errors.title}
                  />
                </div>

                <div>
                  <Select
                    label="Danh mục *"
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    options={categories}
                    placeholder="Chọn danh mục"
                    error={errors.category}
                  />
                </div>

                <div>
                  <Input
                    label="Địa điểm"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ví dụ: Hồ Chí Minh, Việt Nam"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isUrgent" className="text-sm text-gray-700">
                    Dự án gấp
                  </label>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Mô tả dự án</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả ngắn *
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Mô tả ngắn gọn về dự án (1-2 câu)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.shortDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả chi tiết *
                  </label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                    placeholder="Mô tả chi tiết về dự án, yêu cầu kỹ thuật, quy trình thực hiện..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fullDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mục tiêu dự án
                  </label>
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateObjective(index, e.target.value)}
                        placeholder="Mục tiêu dự án"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.objectives.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeObjective(index)}
                          className="px-3 py-2"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addObjective}
                    className="text-sm"
                  >
                    + Thêm mục tiêu
                  </Button>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kỹ năng yêu cầu</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Nhập kỹ năng"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Budget & Timeline */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ngân sách & Thời gian</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Ngân sách tối thiểu *"
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                    placeholder="0"
                    error={errors.budgetMin}
                  />
                </div>
                <div>
                  <Input
                    label="Ngân sách tối đa *"
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                    placeholder="0"
                    error={errors.budgetMax}
                  />
                </div>
                <div>
                  <Select
                    label="Đơn vị tiền tệ"
                    value={formData.currency}
                    onChange={(value) => handleInputChange('currency', value)}
                    options={currencies}
                  />
                </div>
                <div>
                  <Input
                    label="Thời gian thực hiện"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="Ví dụ: 3 tháng"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Hạn chót *"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    error={errors.deadline}
                  />
                </div>
              </div>
            </section>

            {/* Technical Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu kỹ thuật</h2>
              {formData.technicalRequirements.map((req, reqIndex) => (
                <div key={reqIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      value={req.category}
                      onChange={(e) => updateTechnicalRequirement(reqIndex, 'category', e.target.value)}
                      placeholder="Danh mục yêu cầu (ví dụ: Phần mềm, Thiết bị)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {req.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateTechnicalItem(reqIndex, itemIndex, e.target.value)}
                        placeholder="Yêu cầu cụ thể"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addTechnicalItem(reqIndex)}
                      className="text-sm"
                    >
                      + Thêm yêu cầu
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTechnicalRequirement}
                className="text-sm"
              >
                + Thêm danh mục yêu cầu
              </Button>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tài liệu tham khảo</h2>
              <FileUpload
                type="multiple"
                accept={{
                  'application/pdf': ['.pdf'],
                  'application/msword': ['.doc'],
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                  'application/zip': ['.zip'],
                  'application/x-rar-compressed': ['.rar'],
                  'application/octet-stream': ['.dwg']
                }}
                maxSize={10 * 1024 * 1024} // 10MB
                multiple={true}
                bucket="job-attachments"
                placeholder="Tải lên tài liệu tham khảo"
                files={formData.referenceDocuments}
                onFilesUploaded={handleFilesUploaded}
                onRemoveFile={removeDocument}
              />

              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Gợi ý tài liệu tham khảo:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Bản vẽ thiết kế có sẵn hoặc ý tưởng ban đầu</li>
                  <li>Tài liệu kỹ thuật, tiêu chuẩn áp dụng</li>
                  <li>Hình ảnh minh họa dự án tương tự</li>
                  <li>Báo cáo khảo sát hiện trạng</li>
                  <li>Danh sách thiết bị, vật tư có sẵn</li>
                </ul>
              </div>
            </section>

            {/* Deliverables */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm bàn giao</h2>
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={deliverable.title}
                        onChange={(e) => updateDeliverable(index, 'title', e.target.value)}
                        placeholder="Tên sản phẩm bàn giao"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={deliverable.deadline}
                        onChange={(e) => updateDeliverable(index, 'deadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        value={deliverable.description}
                        onChange={(e) => updateDeliverable(index, 'description', e.target.value)}
                        placeholder="Mô tả chi tiết"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {formData.deliverables.length > 1 && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeDeliverable(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa sản phẩm bàn giao
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addDeliverable}
                className="text-sm"
              >
                + Thêm sản phẩm bàn giao
              </Button>
            </section>

            {/* Client Info */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Tên khách hàng"
                    value={formData.client.name}
                    onChange={(e) => handleNestedChange('client', 'name', e.target.value)}
                    placeholder="Tên của bạn"
                  />
                </div>
                <div>
                  <Input
                    label="Công ty"
                    value={formData.client.company}
                    onChange={(e) => handleNestedChange('client', 'company', e.target.value)}
                    placeholder="Tên công ty (nếu có)"
                  />
                </div>
                <div>
                  <Input
                    label="Địa điểm"
                    value={formData.client.location}
                    onChange={(e) => handleNestedChange('client', 'location', e.target.value)}
                    placeholder="Địa điểm của khách hàng"
                  />
                </div>
              </div>
            </section>

            {/* Display Type Selection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Loại hiển thị bài đăng</h2>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Chọn cách thức hiển thị bài đăng của bạn trong marketplace
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Standard Card */}
                  <div 
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      formData.displayType === 'standard' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('displayType', 'standard')}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="displayType"
                        value="standard"
                        checked={formData.displayType === 'standard'}
                        onChange={() => handleInputChange('displayType', 'standard')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Hiển thị thường
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Bài đăng sẽ hiển thị với giao diện tiêu chuẩn, đơn giản và dễ đọc.
                        </p>
                        <div className="text-green-600 font-semibold">
                          Miễn phí
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-gray-500">
                          <div>✓ Hiển thị đầy đủ thông tin</div>
                          <div>✓ Giao diện tiêu chuẩn</div>
                          <div>✓ Tương thích mọi thiết bị</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VIP Card */}
                  <div 
                    className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      formData.displayType === 'vip' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('displayType', 'vip')}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="displayType"
                        value="vip"
                        checked={formData.displayType === 'vip'}
                        onChange={() => handleInputChange('displayType', 'vip')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Hiển thị VIP
                          </h3>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            ⭐ VIP
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Bài đăng nổi bật với hiệu ứng 3D tuyệt đẹp, thu hút nhiều freelancer hơn.
                        </p>
                        <div className="text-purple-600 font-semibold">
                          10.000 VND
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-gray-500">
                          <div>✓ Hiệu ứng 3D chuyên nghiệp</div>
                          <div>✓ Badge VIP nổi bật</div>
                          <div>✓ Hiệu ứng ánh sáng độc đáo</div>
                          <div>✓ Tăng tỷ lệ xem và ứng tuyển</div>
                        </div>
                      </div>
                    </div>
                    {formData.displayType === 'vip' && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Đã chọn
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Notice for VIP */}
                {formData.displayType === 'vip' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-yellow-400 text-lg">💳</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 mb-1">
                          Thông tin thanh toán
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          Phí VIP 10.000 VND sẽ được thu khi đăng bài thành công. 
                          Bài đăng VIP sẽ có hiệu ứng 3D đặc biệt và thu hút nhiều freelancer hơn.
                        </p>
                        <div className="mt-2 text-xs text-yellow-600">
                          <strong>Lưu ý:</strong> Phí VIP chỉ áp dụng cho bài đăng mới. 
                          Bài đăng đã tồn tại có thể nâng cấp lên VIP trong phần chỉnh sửa.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (formData.displayType === 'vip') {
                        window.open('/job-marketplace', '_blank');
                      } else {
                        window.open('/job-marketplace', '_blank');
                      }
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>👁️</span>
                    <span>Xem trước giao diện {formData.displayType === 'vip' ? 'VIP' : 'thường'}</span>
                  </Button>
                </div>
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/job-marketplace')}
              >
                Hủy
              </Button>
              <Button type="submit" className="relative">
                {isEditMode ? 'Cập nhật dự án' : 'Đăng dự án'}
                {formData.displayType === 'vip' && !isEditMode && (
                  <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                    +10.000đ VIP
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
