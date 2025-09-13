import React, { useState } from 'react';
import { 
  Calculator, 
  Cog, 
  Settings, 
  ChevronRight, 
  Download, 
  Share2, 
  BookOpen,
  Search,
  Moon,
  Sun,
  Globe,
  Folder,
  BarChart3,
  FileText,
  Wrench,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Play
} from 'lucide-react';

const CalculationTools = () => {
  const [activeSheet, setActiveSheet] = useState('dam-i-tohop');
  const [activeTab, setActiveTab] = useState('input');
  const [isDark, setIsDark] = useState(false);
  const [unit, setUnit] = useState('SI');

  // Danh sách biên dạng dầm (từ các sheet Excel)
  const beamShapes = [
    {
      id: 'dam-i-tohop',
      name: 'Dầm I tổ hợp',
      description: 'Dầm I hàn từ thép tấm',
      icon: '▢',
      category: 'Dầm I/H'
    },
    {
      id: 'dam-hop-han',
      name: 'Dầm hộp hàn',
      description: 'Dầm hộp hàn từ thép tấm',
      icon: '▭',
      category: 'Dầm hộp'
    },
    {
      id: 'dam-h-can-nong',
      name: 'Dầm H cán nóng',
      description: 'Dầm H cán nóng tiêu chuẩn',
      icon: '▢',
      category: 'Dầm I/H'
    },
    {
      id: 'dam-doi',
      name: 'Dầm đôi',
      description: 'Hệ dầm đôi song song',
      icon: '▢▢',
      category: 'Dầm tổ hợp'
    },
    {
      id: 'dam-u',
      name: 'Dầm chữ U',
      description: 'Dầm tiết diện chữ U',
      icon: '∪',
      category: 'Dầm đặc thù'
    },
    {
      id: 'dam-c',
      name: 'Dầm chữ C',
      description: 'Dầm tiết diện chữ C',
      icon: '⊃',
      category: 'Dầm đặc thù'
    }
  ];

  // Tabs chính cho mỗi biên dạng
  const mainTabs = [
    { id: 'input', name: 'Nhập liệu', icon: <Calculator className="w-4 h-4" /> },
    { id: 'load', name: 'Tải trọng', icon: <Gauge className="w-4 h-4" /> },
    { id: 'material', name: 'Vật liệu & Tiêu chuẩn', icon: <Settings className="w-4 h-4" /> },
    { id: 'result', name: 'Kết quả & Kiểm tra', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'connection', name: 'Chi tiết liên kết', icon: <Wrench className="w-4 h-4" /> },
    { id: 'report', name: 'Xuất báo cáo', icon: <FileText className="w-4 h-4" /> }
  ];

  const activeSheetData = beamShapes.find(shape => shape.id === activeSheet);

  // Nhóm biên dạng theo category
  const groupedShapes = beamShapes.reduce((acc, shape) => {
    if (!acc[shape.category]) acc[shape.category] = [];
    acc[shape.category].push(shape);
    return acc;
  }, {});

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Cog className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold">Tính Toán Dầm Cầu Trục</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <select className={`px-3 py-1 rounded border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <option>Dự án hiện tại</option>
                  <option>Tạo dự án mới</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
                className={`px-3 py-1 rounded border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              >
                <option value="SI">Đơn vị: SI</option>
                <option value="Imperial">Đơn vị: Imperial</option>
              </select>
              
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <select className={`px-3 py-1 rounded border text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                <option>Tiếng Việt</option>
                <option>English</option>
              </select>
              
              <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Share2 className="w-4 h-4 mr-1" />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-full">
        {/* Sidebar trái - Danh sách biên dạng */}
        <div className={`w-80 border-r min-h-screen ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm biên dạng..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
            
            <div className="space-y-4">
              {Object.entries(groupedShapes).map(([category, shapes]) => (
                <div key={category}>
                  <h3 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {shapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => setActiveSheet(shape.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          activeSheet === shape.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : isDark 
                              ? 'hover:bg-gray-700 text-gray-300'
                              : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3 font-mono">{shape.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{shape.name}</div>
                            <div className={`text-xs mt-1 ${
                              activeSheet === shape.id ? 'text-blue-100' : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {shape.description}
                            </div>
                          </div>
                          {activeSheet === shape.id && (
                            <ChevronRight className="w-4 h-4 ml-2" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Khu vực chính */}
        <div className="flex-1 flex">
          {/* Main content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="px-6">
                <div className="flex space-x-8 overflow-x-auto">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : isDark
                            ? 'border-transparent text-gray-400 hover:text-gray-300'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === 'input' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Nhập liệu - {activeSheetData?.name}</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hình học */}
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-blue-600">Hình học</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">L - Nhịp (m)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="12.0" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">h - Chiều cao dầm (mm)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="600" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">bf - Bề rộng cánh (mm)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="200" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">tf - Dày bản cánh (mm)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="12" />
                        </div>
                      </div>
                    </div>

                    {/* Điều kiện biên */}
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-green-600">Điều kiện biên</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Loại gối đỡ</label>
                          <select className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <option>Kê hai đầu</option>
                            <option>Ngàm một đầu</option>
                            <option>Liên tục nhiều gối</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Có sườn đầu</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Có sườn giữa</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'load' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Tải trọng</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-orange-600">Tải bánh xe cầu trục</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Pmax - Tải trọng bánh xe (kN)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">a - Khoảng cách bánh xe (m)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-purple-600">Hệ số động</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">φ - Hệ số động</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="1.1" step="0.1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ψ - Hệ số va đập</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} placeholder="1.25" step="0.1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'material' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Vật liệu & Tiêu chuẩn</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-red-600">Vật liệu</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Loại thép</label>
                          <select className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <option>Q235</option>
                            <option>Q345</option>
                            <option>S235</option>
                            <option>S355</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">E - Môđun đàn hồi (MPa)</label>
                          <input type="number" className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} value="206000" readOnly />
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <h3 className="font-semibold mb-3 text-indigo-600">Tiêu chuẩn</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Tiêu chuẩn kiểm tra</label>
                          <select className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <option>TCVN 5575:2012</option>
                            <option>EN 1993-1-1</option>
                            <option>AISC 360</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Giới hạn võng</label>
                          <select className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                            <option>L/700</option>
                            <option>L/800</option>
                            <option>L/600</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'result' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Kết quả & Kiểm tra</h2>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Kết quả tính toán sẽ hiển thị ở sidebar bên phải.
                  </p>
                </div>
              )}

              {activeTab === 'connection' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Chi tiết liên kết</h2>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Kiểm tra mối hàn và bu lông sẽ được bổ sung sau.
                  </p>
                </div>
              )}

              {activeTab === 'report' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Xuất báo cáo</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-8 h-8 text-red-600 mb-2" />
                      <span className="font-medium">PDF</span>
                      <span className="text-sm text-gray-500">Báo cáo đầy đủ</span>
                    </button>
                    <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-8 h-8 text-green-600 mb-2" />
                      <span className="font-medium">CSV</span>
                      <span className="text-sm text-gray-500">Dữ liệu số</span>
                    </button>
                    <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-8 h-8 text-blue-600 mb-2" />
                      <span className="font-medium">DXF</span>
                      <span className="text-sm text-gray-500">Bản vẽ CAD</span>
                    </button>
                    <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="w-8 h-8 text-purple-600 mb-2" />
                      <span className="font-medium">JSON</span>
                      <span className="text-sm text-gray-500">Dữ liệu thô</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar phải - Kết quả */}
          <div className={`w-80 border-l min-h-screen ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Kết quả tính toán
              </h3>
              
              {/* Tóm tắt nhanh */}
              <div className="space-y-3 mb-6">
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mmax</span>
                    <span className="text-lg font-bold text-blue-600">125.4 kNm</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Momen uốn lớn nhất</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Vmax</span>
                    <span className="text-lg font-bold text-green-600">45.2 kN</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Lực cắt lớn nhất</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">σ</span>
                    <span className="text-lg font-bold text-orange-600">156.8 MPa</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Ứng suất uốn</div>
                </div>
                
                <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">f</span>
                    <span className="text-lg font-bold text-purple-600">8.5 mm</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Võng lớn nhất</div>
                </div>
              </div>

              {/* Tỷ số sử dụng */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tỷ số sử dụng</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ησ</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm font-medium">0.65</span>
                      <CheckCircle className="w-4 h-4 text-green-600 ml-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ητ</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '32%'}}></div>
                      </div>
                      <span className="text-sm font-medium">0.32</span>
                      <CheckCircle className="w-4 h-4 text-green-600 ml-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ηf</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-sm font-medium">0.85</span>
                      <AlertTriangle className="w-4 h-4 text-yellow-500 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút tính toán */}
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Play className="w-4 h-4 mr-2" />
                Tính lại
              </button>

              {/* Khuyến nghị */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Khuyến nghị</h4>
                <div className={`p-3 rounded-lg border-l-4 border-yellow-500 ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <p className="text-sm">Võng gần đạt giới hạn. Khuyến nghị tăng chiều cao dầm hoặc giảm nhịp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationTools;
