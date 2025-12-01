/**
 * ISO 날짜 문자열을 한국어 형식으로 포맷팅
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 1분 미만
  if (diffMins < 1) {
    return '방금 전';
  }

  // 1시간 미만
  if (diffMins < 60) {
    return `${diffMins}분 전`;
  }

  // 24시간 미만
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  // 7일 미만
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  // 그 이상
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 같은 년도면 년도 생략
  if (year === now.getFullYear()) {
    return `${month}.${day}`;
  }

  return `${year}.${month}.${day}`;
};

/**
 * ISO 날짜 문자열을 전체 날짜/시간 형식으로 포맷팅
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
