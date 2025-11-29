export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

/**
 * 브라우저의 Geolocation API를 사용하여 현재 위치를 가져옵니다.
 * @returns Promise<GeolocationPosition> 현재 위치의 위도/경도
 * @throws GeolocationError 위치 정보를 가져올 수 없는 경우
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: '이 브라우저는 위치 정보를 지원하지 않습니다.',
      } as GeolocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let message = '위치 정보를 가져올 수 없습니다.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = '위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            message = '위치 정보 요청 시간이 초과되었습니다.';
            break;
        }

        reject({
          code: error.code,
          message,
        } as GeolocationError);
      },
      {
        enableHighAccuracy: false, // 배터리 절약을 위해 정확도를 낮춤
        timeout: 10000, // 10초 타임아웃
        maximumAge: 300000, // 5분 동안 캐시된 위치 사용 가능
      }
    );
  });
};

/**
 * 두 지점 간의 거리를 계산합니다 (Haversine 공식 사용)
 * @param lat1 첫 번째 지점의 위도
 * @param lng1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lng2 두 번째 지점의 경도
 * @returns 두 지점 간의 거리 (미터)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위
};

/**
 * 거리를 사람이 읽기 쉬운 형식으로 변환합니다
 * @param meters 미터 단위의 거리
 * @returns "1.5km" 또는 "500m" 형식의 문자열
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};
