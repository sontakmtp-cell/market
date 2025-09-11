import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroBanner from './components/HeroBanner';
import ModuleCards from './components/ModuleCards';
import SearchSection from './components/SearchSection';
import PlatformStats from './components/PlatformStats';
import FeaturedSection from './components/FeaturedSection';
import TestimonialsSection from './components/TestimonialsSection';

const Homepage = () => {
  useEffect(() => {
    // Set page title and meta tags
    document.title = 'Kỹ thuật vàng';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const siteUrl = 'https://kythuatvang.com';
  const pageUrl = `${siteUrl}/homepage`;
  const shareImage = `${siteUrl}/assets/images/social-share-default.png`;

  return (
    <>
      <Helmet>
        <title>Kỹ thuật vàng</title>
        <meta 
          name="description" 
          content="Kết nối chuyên gia kỹ thuật với dự án của bạn. Tìm kiếm freelancer, tuyển dụng nhân tài, mua sắm sản phẩm kỹ thuật và sử dụng công cụ tính toán chuyên ngành." 
        />
        <meta name="keywords" content="freelancer kỹ thuật, tuyển dụng kỹ sư, sản phẩm kỹ thuật, công cụ tính toán, AutoCAD, Revit, thiết kế cơ khí" />

        {/* Open Graph */}
        <meta property="og:title" content="Kỹ thuật vàng" />
        <meta property="og:description" content="Kết nối chuyên gia kỹ thuật với dự án của bạn. Hơn 50,000 chuyên gia và 12,847 dự án hoàn thành." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Kỹ thuật vàng" />
        <meta property="og:locale" content="vi_VN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kỹ thuật vàng" />
        <meta name="twitter:description" content="Kết nối chuyên gia kỹ thuật với dự án của bạn. Hơn 50,000 chuyên gia và 12,847 dự án hoàn thành." />
        <meta name="twitter:image" content={shareImage} />

        <link rel="canonical" href="/homepage" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <HeroBanner />

        {/* Main Module Cards */}
        <ModuleCards />

        {/* Search Section */}
        <SearchSection />

        {/* Platform Statistics */}
        <PlatformStats />

        {/* Featured Content */}
        <FeaturedSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Bottom CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-r from-primary to-accent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Sẵn sàng bắt đầu dự án tiếp theo?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Tham gia cộng đồng hơn 50,000 chuyên gia kỹ thuật và 2,000 doanh nghiệp 
                đang tin tưởng Kỹ thuật vàng
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-elevation-2"
                >
                  Đăng ký miễn phí
                </a>
                <a 
                  href="/job-marketplace" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary transition-colors"
                >
                  Khám phá dự án
                </a>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 pt-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Miễn phí đăng ký</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">Bảo mật 100%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 0 0 6.105 6.105l.774-1.548a1 1 0 0 1 1.059-.54l4.435.74a1 1 0 0 1 .836.986V17a1 1 0 0 1-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-sm">Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Homepage;