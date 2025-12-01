import React, { useEffect, useState } from 'react';
import { Lock, Mail, MessageCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { Toast } from './Toast';
import { getUserIdFromToken } from '../utils/jwt';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    console.log('LoginPage useEffect 실행됨');
    console.log('현재 URL:', window.location.href);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    console.log('URL에서 추출한 code:', code);

    if (code) {
      console.log('카카오 인증 코드 받음:', code);

      const params = new URLSearchParams();
      params.append('code', code);

      // 1. 카카오 토큰 받기
      fetch(`${API_BASE_URL}/oauth/kakao/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((tokenData) => {
          console.log('카카오 토큰 응답:', tokenData);
          const kakaoAccessToken = tokenData.access_token;

          if (kakaoAccessToken) {
            // 2. 카카오 액세스 토큰으로 우리 서비스 JWT 받기
            return fetch(`${API_BASE_URL}/oauth/kakao/access`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(kakaoAccessToken),
            });
          } else {
            throw new Error('카카오 액세스 토큰이 없습니다.');
          }
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
        })
        .then((jwt) => {
          console.log('JWT 토큰 받음:', jwt);

          // 3. JWT를 localStorage에 저장
          localStorage.setItem('token', jwt);

          // 4. JWT에서 userId 추출하여 저장
          const userId = getUserIdFromToken(jwt);
          if (userId) {
            localStorage.setItem('userId', userId.toString());
            console.log('userId 저장 완료:', userId);
          } else {
            console.warn('JWT에서 userId를 추출할 수 없습니다.');
          }

          console.log('로그인 성공! 토큰 저장 완료');

          // 5. 로그인 상태 업데이트
          onLogin?.();

          // 6. 토스트 알림 표시
          setShowToast(true);

          // 7. 잠시 후 홈으로 이동
          setTimeout(() => {
            window.history.replaceState({}, '', '/');
            onNavigate?.('home');
          }, 1500);
        })
        .catch((err) => {
          console.error('카카오 로그인 처리 실패:', err);
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
        });
    }
  }, []);

  const handleKakaoLogin = async () => {
    try {
      console.log('카카오 로그인 요청 시작...');

      const response = await fetch(`${API_BASE_URL}/oauth/kakao`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const authUrl = await response.text();

      console.log('받은 응답:', authUrl);

      window.location.href = authUrl;
    } catch (err) {
      console.error('카카오 로그인 실패:', err);
      alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      {showToast && <Toast message="로그인 되었습니다! 🎉" onClose={() => setShowToast(false)} />}
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
          <button
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#FEE500] text-[#000000] rounded-xl hover:bg-[#fdd800] transition-colors font-semibold"
          >
            <MessageCircle className="w-6 h-6" />
            <span>카카오로 시작하기</span>
          </button>
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
    </>
  );
};
