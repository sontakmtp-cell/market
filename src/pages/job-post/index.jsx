import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { saveProject } from '../../utils/dataStore';

const JobPost = () => {
  const navigate = useNavigate();
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

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    setFormData(prev => ({
      ...prev,
      referenceDocuments: [...prev.referenceDocuments, ...newDocuments]
    }));
  };

  const removeDocument = (docId) => {
    setFormData(prev => ({
      ...prev,
      referenceDocuments: prev.referenceDocuments.filter(doc => doc.id !== docId)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        referenceDocuments: formData.referenceDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          size: doc.size,
          type: doc.type
          // Note: In a real app, you would upload the file to a server here
          // and store the URL instead of the file object
        }))
      };

      const savedProject = await saveProject(cleanData);
      if (savedProject?.id) {
        navigate(`/job-details?id=${savedProject.id}`);
      } else {
        console.error('Project was not saved or missing id:', savedProject);
        alert('Không thể lưu dự án. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Có lỗi xảy ra khi đăng dự án. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng dự án mới</h1>
            <p className="text-gray-600">Cung cấp thông tin chi tiết về dự án để thu hút các freelancer phù hợp</p>
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

            {/* Reference Documents */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tài liệu tham khảo</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-gray-600">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-500 font-medium">Tải lên tài liệu</span>
                        <span> hoặc kéo thả tệp vào đây</span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.dwg,.jpg,.jpeg,.png,.zip,.rar"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ: PDF, DOC, DOCX, DWG, JPG, PNG, ZIP, RAR (tối đa 10MB mỗi file)
                    </p>
                  </div>
                </div>

                {formData.referenceDocuments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Tài liệu đã tải lên:</h3>
                    {formData.referenceDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {doc.type.includes('image') ? (
                              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            ) : doc.type.includes('pdf') ? (
                              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="flex-shrink-0 text-red-400 hover:text-red-600 p-1"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <p><strong>Gợi ý tài liệu tham khảo:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Bản vẽ thiết kế có sẵn hoặc ý tưởng ban đầu</li>
                    <li>Tài liệu kỹ thuật, tiêu chuẩn áp dụng</li>
                    <li>Hình ảnh minh họa dự án tương tự</li>
                    <li>Báo cáo khảo sát hiện trạng</li>
                    <li>Danh sách thiết bị, vật tư có sẵn</li>
                  </ul>
                </div>
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

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/job-marketplace')}
              >
                Hủy
              </Button>
              <Button type="submit">
                Đăng dự án
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPost;
