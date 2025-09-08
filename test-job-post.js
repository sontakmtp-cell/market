// Test script để tạo dữ liệu test cho job-post feature
import { saveProject } from './src/utils/dataStore.js';

// Tạo một dự án test
const testProject = {
  title: 'Thiết kế hệ thống điều hòa tòa nhà văn phòng 20 tầng',
  shortDescription: 'Cần thiết kế hệ thống HVAC cho tòa nhà văn phòng 20 tầng, bao gồm tính toán tải nhiệt và lựa chọn thiết bị.',
  fullDescription: `Dự án thiết kế hệ thống điều hòa không khí cho tòa nhà văn phòng 20 tầng với tổng diện tích 15,000m².

Yêu cầu công việc:
- Tính toán tải nhiệt chi tiết cho từng tầng
- Thiết kế hệ thống đường ống và thiết bị
- Lựa chọn máy lạnh trung tâm phù hợp
- Vẽ bản vẽ thi công chi tiết
- Lập thuyết minh kỹ thuật

Thông tin dự án:
- Địa điểm: Quận 1, TP.HCM
- Diện tích: 15,000m² (750m²/tầng)
- Thời gian thi công: 6 tháng
- Tiêu chuẩn: ASHRAE, TCVN`,
  category: 'mechanical',
  skills: ['AutoCAD', 'HVAC Design', 'HAP Software', 'Carrier HAP', 'Tính toán tải nhiệt'],
  budgetMin: 50000000,
  budgetMax: 80000000,
  currency: 'VND',
  duration: '4 tháng',
  deadline: '2025-12-31',
  isUrgent: true,
  location: 'Quận 1, TP.HCM',
  objectives: [
    'Thiết kế hệ thống HVAC tiết kiệm năng lượng',
    'Đảm bảo chất lượng không khí trong nhà',
    'Tối ưu hóa chi phí vận hành',
    'Tuân thủ các tiêu chuẩn kỹ thuật'
  ],
  technicalRequirements: [
    {
      category: 'Phần mềm thiết kế',
      items: [
        'AutoCAD 2020 trở lên',
        'Carrier HAP hoặc Elite CHVAC',
        'Revit MEP (ưu tiên)'
      ]
    },
    {
      category: 'Tiêu chuẩn kỹ thuật',
      items: [
        'ASHRAE Standard 90.1',
        'TCVN 5438:2007',
        'QCVN 09:2013/BXD'
      ]
    }
  ],
  deliverables: [
    {
      title: 'Báo cáo tính toán tải nhiệt',
      description: 'Tính toán chi tiết tải nhiệt từng tầng và tổng thể',
      deadline: '2025-10-15'
    },
    {
      title: 'Bản vẽ thiết kế kỹ thuật',
      description: 'Bộ bản vẽ hoàn chỉnh hệ thống HVAC',
      deadline: '2025-11-30'
    },
    {
      title: 'Thuyết minh thiết kế',
      description: 'Thuyết minh kỹ thuật và hướng dẫn vận hành',
      deadline: '2025-12-15'
    }
  ],
  client: {
    name: 'Công ty CP Đầu tư Xây dựng Sài Gòn',
    company: 'Saigon Construction Investment JSC',
    rating: 4.7,
    reviewCount: 15,
    location: 'TP.HCM'
  }
};

console.log('Test project data:', testProject);
