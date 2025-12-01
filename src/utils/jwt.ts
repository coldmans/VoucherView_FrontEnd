/**
 * JWT 토큰에서 페이로드를 추출합니다.
 * @param token JWT 토큰
 * @returns 디코딩된 페이로드 객체
 */
export const decodeJwt = (token: string): any => {
  try {
    // JWT는 header.payload.signature 형식
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // payload 부분 (두 번째 부분)
    const payload = parts[1];

    // Base64 URL 디코딩
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT 디코딩 실패:', error);
    return null;
  }
};

/**
 * JWT 토큰에서 userId를 추출합니다.
 * @param token JWT 토큰
 * @returns userId (없으면 null)
 */
export const getUserIdFromToken = (token: string): number | null => {
  const payload = decodeJwt(token);
  if (!payload) return null;

  // 백엔드에서 사용하는 필드명에 따라 수정 필요
  // 일반적으로 'sub', 'userId', 'id' 등을 사용
  const userId = payload.sub || payload.userId || payload.id;

  return userId ? parseInt(userId, 10) : null;
};
