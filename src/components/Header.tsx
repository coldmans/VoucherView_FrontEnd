import React, { useState } from 'react';
import { Search, User, Heart, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isLoggedIn, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0D1B2A] text-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => onNavigate?.('home')}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#16E0B4] rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 md:w-6 md:h-6 text-[#0D1B2A]" />
            </div>
            <span className="font-bold tracking-tight text-sm md:text-base">스포츠시설 검색</span>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => onNavigate?.('home')}
              className={`hover:text-[#16E0B4] transition-colors ${currentPage === 'home' ? 'text-[#16E0B4]' : ''}`}
            >
              홈
            </button>
            <button 
              onClick={() => onNavigate?.('search')}
              className={`hover:text-[#16E0B4] transition-colors ${currentPage === 'search' ? 'text-[#16E0B4]' : ''}`}
            >
              시설 검색
            </button>
            <button className="hover:text-[#16E0B4] transition-colors">
              게시판
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('mypage')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>마이페이지</span>
            </button>
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ee5a5a] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>로그아웃</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate?.('login')}
                className="flex items-center gap-2 px-4 py-2 bg-[#16E0B4] text-[#0D1B2A] rounded-lg hover:bg-[#14c9a0] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>로그인</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  onNavigate?.('home');
                  setMobileMenuOpen(false);
                }}
                className={`text-left hover:text-[#16E0B4] transition-colors ${currentPage === 'home' ? 'text-[#16E0B4]' : ''}`}
              >
                홈
              </button>
              <button 
                onClick={() => {
                  onNavigate?.('search');
                  setMobileMenuOpen(false);
                }}
                className={`text-left hover:text-[#16E0B4] transition-colors ${currentPage === 'search' ? 'text-[#16E0B4]' : ''}`}
              >
                시설 검색
              </button>
              <button className="text-left hover:text-[#16E0B4] transition-colors">
                게시판
              </button>
              <button
                onClick={() => {
                  onNavigate?.('mypage');
                  setMobileMenuOpen(false);
                }}
                className="text-left hover:text-[#16E0B4] transition-colors"
              >
                마이페이지
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ee5a5a] transition-colors justify-center"
                >
                  <User className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate?.('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#16E0B4] text-[#0D1B2A] rounded-lg hover:bg-[#14c9a0] transition-colors justify-center"
                >
                  <User className="w-5 h-5" />
                  <span>로그인</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
