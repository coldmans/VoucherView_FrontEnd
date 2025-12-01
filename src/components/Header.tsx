import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, Menu, X, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    navigate('/');
  };

  return (
    <header className="bg-[#0D1B2A] text-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#16E0B4] rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 md:w-6 md:h-6 text-[#0D1B2A]" />
            </div>
            <span className="font-bold tracking-tight text-sm md:text-base">스포츠시설 검색</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`hover:text-[#16E0B4] transition-colors ${location.pathname === '/' ? 'text-[#16E0B4]' : ''}`}
            >
              홈
            </Link>
            <Link
              to="/search"
              className={`hover:text-[#16E0B4] transition-colors ${location.pathname === '/search' ? 'text-[#16E0B4]' : ''}`}
            >
              시설 검색
            </Link>
            <Link
              to="/community"
              className={`flex items-center gap-2 hover:text-[#16E0B4] transition-colors ${location.pathname.startsWith('/community') ? 'text-[#16E0B4]' : ''}`}
            >
              <MessageSquare className="w-4 h-4" />
              커뮤니티
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/mypage"
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>마이페이지</span>
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ee5a5a] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>로그아웃</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-[#16E0B4] text-[#0D1B2A] rounded-lg hover:bg-[#14c9a0] transition-colors"
              >
                <User className="w-5 h-5" />
                <span>로그인</span>
              </Link>
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
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left hover:text-[#16E0B4] transition-colors ${location.pathname === '/' ? 'text-[#16E0B4]' : ''}`}
              >
                홈
              </Link>
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left hover:text-[#16E0B4] transition-colors ${location.pathname === '/search' ? 'text-[#16E0B4]' : ''}`}
              >
                시설 검색
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left hover:text-[#16E0B4] transition-colors ${location.pathname.startsWith('/community') ? 'text-[#16E0B4]' : ''}`}
              >
                커뮤니티
              </Link>
              <Link
                to="/mypage"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left hover:text-[#16E0B4] transition-colors"
              >
                마이페이지
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#ee5a5a] transition-colors justify-center"
                >
                  <User className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#16E0B4] text-[#0D1B2A] rounded-lg hover:bg-[#14c9a0] transition-colors justify-center"
                >
                  <User className="w-5 h-5" />
                  <span>로그인</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
