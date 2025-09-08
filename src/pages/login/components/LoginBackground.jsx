import React from 'react';
import Image from '../../../components/AppImage';

const LoginBackground = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 z-10"></div>
      
      <Image
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Technical engineering workspace with blueprints and tools"
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold mb-6">
            Nền tảng Dịch vụ Kỹ thuật Hàng đầu
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Kết nối chuyên gia kỹ thuật, khách hàng và nhà tuyển dụng trong một hệ sinh thái toàn diện
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="opacity-80">Chuyên gia kỹ thuật</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">5,000+</div>
              <div className="opacity-80">Dự án hoàn thành</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">1,200+</div>
              <div className="opacity-80">Công ty đối tác</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">98%</div>
              <div className="opacity-80">Độ hài lòng</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBackground;