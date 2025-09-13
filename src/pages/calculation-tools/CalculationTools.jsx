import React, { useState } from 'react';
import { 
  Calculator, 
  Cog, 
  Moon,
  Sun,
  CheckCircle
} from 'lucide-react';

const CalculationTools = () => {
  const [activeSheet, setActiveSheet] = useState('dam-i-tohop');
  const [isDark, setIsDark] = useState(false);
  const [unit, setUnit] = useState('SI');

  // Danh sách biên dạng dầm (từ các sheet Excel)
  const beamShapes = [
    {
      id: 'dam-i-tohop',
      name: 'Dầm I tổ hợp',
      description: 'Dầm I hàn từ thép tấm',
      icon: '▢',
    },
    {
      id: 'dam-hop-han',
      name: 'Dầm hộp hàn',
      description: 'Dầm hộp hàn từ thép tấm',
      icon: '▭',
    },
    {
      id: 'dam-h-can-nong',
      name: 'Dầm H cán nóng',
      description: 'Dầm H cán nóng tiêu chuẩn',
      icon: '▢',
    },
    {
      id: 'dam-doi',
      name: 'Dầm đôi',
      description: 'Hệ dầm đôi song song',
      icon: '▢▢',
    },
    {
      id: 'dam-u',
      name: 'Dầm chữ U',
      description: 'Dầm tiết diện chữ U',
      icon: '∪',
    },
    {
      id: 'dam-c',
      name: 'Dầm chữ C',
      description: 'Dầm tiết diện chữ C',
      icon: '⊃',
    }
  ];

  const activeSheetData = beamShapes.find(shape => shape.id === activeSheet);

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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Chọn loại dầm */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Chọn loại dầm</h2>
          <div className="flex flex-wrap gap-3">
            {beamShapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => setActiveSheet(shape.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSheet === shape.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <span className="font-mono mr-2">{shape.icon}</span>
                {shape.name}
              </button>
            ))}
          </div>
        </div>

        {/* Layout 2 cột chính */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cột trái - Nhập liệu */}
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Nhập liệu thiết kế</h3>
            
            {/* Thông số hình học */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Thông số hình học</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">L - Nhịp (m)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="12.0"
                    defaultValue="12.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">h - Chiều cao dầm (mm)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="600"
                    defaultValue="600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">bf - Bề rộng cánh (mm)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="200"
                    defaultValue="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">tf - Dày bản cánh (mm)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="12"
                    defaultValue="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">tw - Dày bản bụng (mm)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="8"
                    defaultValue="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">s - Khoảng cách sườn (m)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="2.0"
                    defaultValue="2.0"
                  />
                </div>
              </div>
            </div>

            {/* Tải trọng */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Tải trọng</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pmax - Tải bánh xe (kN)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="50"
                    defaultValue="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">a - Khoảng cách bánh xe (m)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="1.5"
                    defaultValue="1.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">φ - Hệ số động</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="1.1"
                    defaultValue="1.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ψ - Hệ số va đập</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    placeholder="1.25"
                    defaultValue="1.25"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Vật liệu */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Vật liệu</h4>
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium mb-1">fy - Giới hạn chảy (MPa)</label>
                  <input 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded-md text-sm ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    value="235" 
                    readOnly 
                  />
                </div>
              </div>
            </div>

            {/* Nút tính toán */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm font-medium">
              <Calculator className="w-4 h-4 mr-2" />
              Tính toán
            </button>
          </div>

          {/* Cột phải - Hình ảnh minh họa */}
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-4 text-green-600">Hình ảnh minh họa</h3>
            
            {/* Hình ảnh tiết diện dầm */}
            <div className={`h-80 rounded-lg border-2 border-dashed flex items-center justify-center mb-4 ${isDark ? 'border-gray-600 bg-gray-750' : 'border-gray-300 bg-gray-50'}`}>
              <div className="text-center">
                {activeSheetData && (
                  <div>
                    <div className="text-6xl font-mono mb-4 text-blue-600">{activeSheetData.icon}</div>
                    <h4 className="font-medium text-lg">{activeSheetData.name}</h4>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activeSheetData.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thông số tiết diện */}
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-3">Thông số hiển thị</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>h:</span>
                  <span className="font-mono">600 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>bf:</span>
                  <span className="font-mono">200 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>tf:</span>
                  <span className="font-mono">12 mm</span>
                </div>
                <div className="flex justify-between">
                  <span>tw:</span>
                  <span className="font-mono">8 mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng kết quả tính toán */}
        <div className={`mt-8 p-6 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Bảng tổng hợp kết quả</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className="text-left py-3 px-4 font-medium">Thông số</th>
                  <th className="text-center py-3 px-4 font-medium">Ký hiệu</th>
                  <th className="text-center py-3 px-4 font-medium">Giá trị</th>
                  <th className="text-center py-3 px-4 font-medium">Đơn vị</th>
                  <th className="text-center py-3 px-4 font-medium">Kết luận</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4">Momen quán tính</td>
                  <td className="py-3 px-4 text-center font-mono">Ix</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600">1.25 × 10⁸</td>
                  <td className="py-3 px-4 text-center">mm⁴</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Đạt</span>
                  </td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4">Diện tích mặt cắt ngang</td>
                  <td className="py-3 px-4 text-center font-mono">A</td>
                  <td className="py-3 px-4 text-center font-mono text-blue-600">9,632</td>
                  <td className="py-3 px-4 text-center">mm²</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Đạt</span>
                  </td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4">Ứng suất uốn tổng</td>
                  <td className="py-3 px-4 text-center font-mono">σ</td>
                  <td className="py-3 px-4 text-center font-mono text-orange-600">156.8</td>
                  <td className="py-3 px-4 text-center">MPa</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Đạt</span>
                  </td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4">Hệ số K</td>
                  <td className="py-3 px-4 text-center font-mono">K</td>
                  <td className="py-3 px-4 text-center font-mono text-purple-600">1.15</td>
                  <td className="py-3 px-4 text-center">-</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Đạt</span>
                  </td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <td className="py-3 px-4">Hệ số an toàn</td>
                  <td className="py-3 px-4 text-center font-mono">SF</td>
                  <td className="py-3 px-4 text-center font-mono text-green-600">1.49</td>
                  <td className="py-3 px-4 text-center">-</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">An toàn</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kết luận tổng quát */}
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Kết luận chung</h4>
            </div>
            <p className="text-green-700 text-sm">
              Dầm đảm bảo các điều kiện về cường độ, độ cứng và ổn định. Thiết kế an toàn với hệ số an toàn SF = 1.49 &gt; 1.25 (yêu cầu tối thiểu).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationTools;
