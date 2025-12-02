import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  variant = 'warning',
}) => {
  if (!isOpen) return null;

  const variantColors = {
    danger: {
      icon: '#FF6B6B',
      confirmBg: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: '#FFA726',
      confirmBg: 'bg-[#FFA726] hover:bg-[#F57C00]',
    },
    info: {
      icon: '#42A5F5',
      confirmBg: 'bg-[#42A5F5] hover:bg-[#1E88E5]',
    },
  };

  const colors = variantColors[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.icon + '20' }}
            >
              <AlertCircle className="w-8 h-8" style={{ color: colors.icon }} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#0D1B2A] text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-[#8B9DA9] text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-[#E1E8ED] text-[#8B9DA9] font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-colors ${colors.confirmBg}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
