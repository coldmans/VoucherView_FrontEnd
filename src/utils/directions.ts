import { apiClient } from './apiClient';
import { API_BASE_URL } from '../config/api';

export interface DirectionsResponse {
  code: number;
  message: string;
  currentDateTime: string;
  route: {
    traoptimal?: RouteUnit[];
  };
}

export interface RouteUnit {
  summary: {
    start: {
      location: [number, number];
    };
    goal: {
      location: [number, number];
    };
    distance: number; // 총 거리 (m)
    duration: number; // 총 소요 시간 (ms)
    etaServiceType: number;
    tollFare: number; // 통행료
    taxiFare: number; // 택시 요금
    fuelPrice: number; // 유류비
  };
  path: [number, number][];
  section: any[];
  guide: any[];
}

export interface DirectionsParams {
  start: string; // "경도,위도" 형식
  goal: string; // "경도,위도" 형식
  option?: string; // trafast(실시간 빠른길), tracomfort(편한길), traoptimal(실시간 최적), traavoidtoll(무료도로), traavoidcaronly(자동차전용도로 회피)
}

/**
 * 네이버 Directions 15 API 호출 (백엔드 프록시 사용)
 */
export const getDirections = async (
  params: DirectionsParams
): Promise<DirectionsResponse> => {
  const { start, goal, option = 'traoptimal' } = params;

  const url = `${API_BASE_URL}/api/directions/driving?start=${start}&goal=${goal}&option=${option}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Directions API failed: ${response.status}`);
  }

  return response.json();
};

/**
 * 거리를 km로 포맷
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

/**
 * 시간을 분/시간으로 포맷
 */
export const formatDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}시간 ${remainingMinutes}분`;
};

/**
 * 요금을 원으로 포맷
 */
export const formatFare = (won: number): string => {
  return `${won.toLocaleString()}원`;
};
