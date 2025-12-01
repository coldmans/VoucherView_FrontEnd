import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 마운트 시 애니메이션 시작
    setTimeout(() => setIsVisible(true), 10);

    // 자동 닫기
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      border: 'border-[#16E0B4]',
      bg: 'bg-[#16E0B4]',
      icon: CheckCircle,
    },
    error: {
      border: 'border-red-500',
      bg: 'bg-red-500',
      icon: AlertCircle,
    },
  };

  const currentStyle = styles[type];
  const Icon = currentStyle.icon;

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`bg-white rounded-2xl shadow-2xl border-2 ${currentStyle.border} px-6 py-4 flex items-center gap-3 min-w-[300px]`}>
        <div className={`w-10 h-10 ${currentStyle.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="flex-1 font-semibold text-[#0D1B2A]">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-[#8B9DA9] hover:text-[#0D1B2A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
