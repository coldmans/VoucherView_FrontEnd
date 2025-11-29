import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { FacilityDetailPage } from './components/FacilityDetailPage';
import { LoginPage } from './components/LoginPage';
import { MyPage } from './components/MyPage';

type Page = 'home' | 'search' | 'detail' | 'login' | 'mypage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'search' && <SearchResultsPage onNavigate={handleNavigate} />}
      {currentPage === 'detail' && <FacilityDetailPage onNavigate={handleNavigate} />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'mypage' && <MyPage />}

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h4 className="mb-4">스포츠시설 검색</h4>
              <p className="text-[#8B9DA9]">
                50,000개 이상의 운동 시설 데이터를<br />
                빠르고 정확하게 검색하세요
              </p>
            </div>
            <div>
              <h4 className="mb-4">서비스</h4>
              <ul className="space-y-2 text-[#8B9DA9]">
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">시설 검색</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">종목별 찾기</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">지역별 찾기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">고객지원</h4>
              <ul className="space-y-2 text-[#8B9DA9]">
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">이용 안내</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">회사</h4>
              <ul className="space-y-2 text-[#8B9DA9]">
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-[#16E0B4] transition-colors">이용약관</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-white/10 text-[#8B9DA9] text-xs md:text-sm">
            <p>© 2024 스포츠시설 검색. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
