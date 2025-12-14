import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { FacilityDetailPage } from './components/FacilityDetailPage';
import { LoginPage } from './components/LoginPage';
import { MyPage } from './components/MyPage';
import { CommunityPage } from './components/CommunityPage';
import { PostDetailPage } from './components/PostDetailPage';
import { PostWritePage } from './components/PostWritePage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/facility/:id" element={<FacilityDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:postId" element={<PostDetailPage />} />
          <Route path="/community/write" element={<PostWritePage />} />
          <Route path="/community/edit/:postId" element={<PostWritePage />} />
        </Routes>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-6 md:py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center text-[#8B9DA9] text-xs md:text-sm">
            <p>© 2024 스포츠시설 검색. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </BrowserRouter>
  );
}
