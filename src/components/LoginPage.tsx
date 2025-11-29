import React from 'react';
import { Lock, Mail, MessageCircle, Chrome } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center py-8 md:py-16">
      <div className="max-w-md w-full mx-4 md:mx-0">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#16E0B4] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[#0D1B2A]" />
          </div>
          <h2 className="mb-3">로그인</h2>
          <p className="text-[#8B9DA9]">
            리뷰·별점·댓글 작성 시에만<br />
            로그인이 필요합니다
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#FEE500] text-[#000000] rounded-xl hover:bg-[#fdd800] transition-colors font-semibold">
              <MessageCircle className="w-6 h-6" />
              <span>카카오로 시작하기</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 py-4 bg-[#03C75A] text-white rounded-xl hover:bg-[#02b350] transition-colors font-semibold">
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#03C75A] font-bold">N</span>
              <span>네이버로 시작하기</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-[#E1E8ED] rounded-xl hover:border-[#0D1B2A] transition-colors font-semibold">
              <Chrome className="w-6 h-6" />
              <span>구글로 시작하기</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#16E0B4]/10 to-[#16E0B4]/5 border-2 border-[#16E0B4] rounded-2xl p-6">
          <h4 className="mb-3">💡 로그인 없이 이용 가능</h4>
          <ul className="space-y-2 text-[#8B9DA9]">
            <li className="flex items-start gap-2">
              <span className="text-[#16E0B4] font-bold">✓</span>
              <span>시설 검색 및 정보 확인</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16E0B4] font-bold">✓</span>
              <span>리뷰 및 평점 조회</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#16E0B4] font-bold">✓</span>
              <span>지역별·종목별 필터링</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-[#E1E8ED]">
          <h4 className="mb-3">🔒 로그인 시 이용 가능</h4>
          <ul className="space-y-2 text-[#8B9DA9]">
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#0D1B2A] flex-shrink-0 mt-0.5" />
              <span>별점 및 리뷰 작성</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#0D1B2A] flex-shrink-0 mt-0.5" />
              <span>댓글 작성</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-[#0D1B2A] flex-shrink-0 mt-0.5" />
              <span>관심 시설 찜하기</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
