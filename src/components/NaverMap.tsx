import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Clock, Banknote } from 'lucide-react';
import { getDirections, formatDistance, formatDuration, formatFare } from '../utils/directions';
import { getCurrentPosition } from '../utils/geolocation';

interface NaverMapProps {
  latitude: number;
  longitude: number;
  facilityName: string;
  address: string;
}

declare global {
  interface Window {
    naver: any;
  }
}

export const NaverMap: React.FC<NaverMapProps> = ({
  latitude,
  longitude,
  facilityName,
  address,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    // 네이버 지도 스크립트 로드
    const loadNaverMapScript = () => {
      return new Promise((resolve, reject) => {
        // 이미 로드되어 있으면 바로 resolve
        if (window.naver && window.naver.maps) {
          resolve(window.naver);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${
          import.meta.env.VITE_NAVER_MAP_CLIENT_ID
        }`;
        script.async = true;
        script.onload = () => resolve(window.naver);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        await loadNaverMapScript();

        if (!mapRef.current || !window.naver) return;

        // 백엔드에서 latitude/longitude 변수명이 실제로는 반대 (ST_X=경도, ST_Y=위도)
        const location = new window.naver.maps.LatLng(longitude, latitude);

        // 지도 옵션
        const mapOptions = {
          center: location,
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        // 지도 생성
        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // 지도 크기 재조정 (타일 로딩 문제 해결)
        setTimeout(() => {
          window.naver.maps.Event.trigger(map, 'resize');
        }, 100);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: location,
          map: map,
          title: facilityName,
        });

        // 정보창 생성
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 15px; min-width: 200px;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #0D1B2A;">
                ${facilityName}
              </h4>
              <p style="margin: 0; font-size: 12px; color: #8B9DA9; line-height: 1.4;">
                ${address}
              </p>
            </div>
          `,
        });

        // 마커 클릭 시 정보창 열기
        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });

        // 초기에 정보창 열기
        infoWindow.open(map, marker);
      } catch (error) {
        console.error('네이버 지도 로드 실패:', error);
      }
    };

    initMap();

    // cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [latitude, longitude, facilityName, address]);

  const handleFindRoute = async () => {
    try {
      setIsLoadingRoute(true);

      // 현재 위치 가져오기
      const currentPos = await getCurrentPosition();

      // 길찾기 API 호출 (경도,위도 순서)
      const result = await getDirections({
        start: `${currentPos.lng},${currentPos.lat}`,
        goal: `${latitude},${longitude}`, // 백엔드에서 latitude/longitude가 반대
        option: 'traoptimal',
      });

      if (result.code === 0 && result.route.traoptimal) {
        const route = result.route.traoptimal[0];
        setRouteInfo(route.summary);

        // 지도에 경로 그리기
        if (mapInstanceRef.current && window.naver) {
          // 기존 경로 제거
          if (polylineRef.current) {
            polylineRef.current.setMap(null);
          }

          // 경로 좌표 변환 (Directions API는 경도,위도 순서)
          const path = route.path.map(
            (coord: [number, number]) =>
              new window.naver.maps.LatLng(coord[1], coord[0])
          );

          // 폴리라인 그리기
          const polyline = new window.naver.maps.Polyline({
            map: mapInstanceRef.current,
            path: path,
            strokeColor: '#16E0B4',
            strokeWeight: 5,
            strokeOpacity: 0.8,
          });

          polylineRef.current = polyline;

          // 지도 범위 조정
          const bounds = new window.naver.maps.LatLngBounds(
            new window.naver.maps.LatLng(currentPos.lat, currentPos.lng),
            new window.naver.maps.LatLng(longitude, latitude)
          );
          mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
        }
      }
    } catch (error: any) {
      alert(error.message || '길찾기에 실패했습니다.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  return (
    <div>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-[#E1E8ED] mb-4"
        style={{ width: '100%', height: '400px' }}
      />

      {/* 길찾기 버튼 */}
      <button
        onClick={handleFindRoute}
        disabled={isLoadingRoute}
        className="w-full px-6 py-3 bg-[#16E0B4] text-white rounded-xl font-semibold hover:bg-[#12c9a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Navigation className="w-5 h-5" />
        {isLoadingRoute ? '경로 검색 중...' : '현재 위치에서 길찾기'}
      </button>

      {/* 경로 정보 표시 */}
      {routeInfo && (
        <div className="mt-4 p-4 bg-[#F5F7FA] rounded-xl space-y-3">
          <h4 className="font-semibold text-[#0D1B2A] mb-3">경로 정보</h4>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#16E0B4]/20 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-[#16E0B4]" />
            </div>
            <div>
              <p className="text-sm text-[#8B9DA9]">거리</p>
              <p className="font-semibold text-[#0D1B2A]">
                {formatDistance(routeInfo.distance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#42A5F5]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#42A5F5]" />
            </div>
            <div>
              <p className="text-sm text-[#8B9DA9]">소요 시간</p>
              <p className="font-semibold text-[#0D1B2A]">
                {formatDuration(routeInfo.duration)}
              </p>
            </div>
          </div>

          {routeInfo.taxiFare > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFA726]/20 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-[#FFA726]" />
              </div>
              <div>
                <p className="text-sm text-[#8B9DA9]">예상 택시 요금</p>
                <p className="font-semibold text-[#0D1B2A]">
                  {formatFare(routeInfo.taxiFare)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
