import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createPost, getPostById, updatePost } from '../api/post';
import {
  PostCategory,
  PostCategoryLabels,
  CreatePostRequest,
} from '../types/post';
import { ConfirmDialog } from './ConfirmDialog';

export const PostWritePage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(postId);

  const [category, setCategory] = useState<PostCategory>(PostCategory.FREE);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 다이얼로그 상태
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    variant: 'info' as 'danger' | 'warning' | 'info',
    onConfirm: () => {},
  });

  const showInfoDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialogConfig({ title, message, variant: 'info', onConfirm });
    setShowDialog(true);
  };

  const showWarningDialog = (title: string, message: string, onConfirm: () => void) => {
    setDialogConfig({ title, message, variant: 'warning', onConfirm });
    setShowDialog(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      showWarningDialog('로그인 필요', '로그인이 필요합니다.', () => {
        setShowDialog(false);
        navigate('/login');
      });
      return;
    }

    if (isEditMode && postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const post = await getPostById(Number(postId));
      const userId = localStorage.getItem('userId');

      // 작성자 확인
      if (userId && post.userId.toString() !== userId) {
        showWarningDialog('권한 없음', '수정 권한이 없습니다.', () => {
          setShowDialog(false);
          navigate('/community');
        });
        return;
      }

      setCategory(post.category);
      setTitle(post.title);
      setContent(post.content);
    } catch (error) {
      console.error('게시물 조회 실패:', error);
      showWarningDialog('오류', '게시물을 찾을 수 없습니다.', () => {
        setShowDialog(false);
        navigate('/community');
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showWarningDialog('입력 필요', '제목을 입력해주세요.', () => {
        setShowDialog(false);
      });
      return;
    }

    if (!content.trim()) {
      showWarningDialog('입력 필요', '내용을 입력해주세요.', () => {
        setShowDialog(false);
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const postData: CreatePostRequest = {
        category,
        title: title.trim(),
        content: content.trim(),
      };

      if (isEditMode && postId) {
        await updatePost(Number(postId), postData);
        showInfoDialog('수정 완료', '게시물이 수정되었습니다.', () => {
          setShowDialog(false);
          navigate(`/community/${postId}`);
        });
      } else {
        const newPost = await createPost(postData);
        showInfoDialog('작성 완료', '게시물이 작성되었습니다.', () => {
          setShowDialog(false);
          navigate(`/community/${newPost.postId}`);
        });
      }
    } catch (error) {
      console.error('게시물 저장 실패:', error);
      showWarningDialog('저장 실패', '게시물 저장에 실패했습니다.', () => {
        setShowDialog(false);
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#8B9DA9] hover:text-[#0D1B2A] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>

        <div className="bg-white rounded-xl p-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-8">
            {isEditMode ? '게시물 수정' : '게시물 작성'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-3">
                카테고리
              </label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(PostCategoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key as PostCategory)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      category === key
                        ? 'bg-[#16E0B4] text-white'
                        : 'bg-[#F5F7FA] text-[#8B9DA9] hover:bg-[#E1E8ED]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-3">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full p-4 rounded-xl border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none"
                maxLength={100}
              />
              <div className="text-right text-sm text-[#8B9DA9] mt-1">
                {title.length}/100
              </div>
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-semibold text-[#0D1B2A] mb-3">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full p-4 rounded-xl border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none resize-none"
                rows={15}
                maxLength={5000}
              />
              <div className="text-right text-sm text-[#8B9DA9] mt-1">
                {content.length}/5000
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border-2 border-[#E1E8ED] text-[#8B9DA9] font-semibold hover:bg-[#F5F7FA] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#16E0B4] text-white rounded-xl font-semibold hover:bg-[#12c9a0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? '저장 중...'
                  : isEditMode
                  ? '수정 완료'
                  : '작성 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDialog}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText="확인"
        onConfirm={dialogConfig.onConfirm}
        onCancel={() => setShowDialog(false)}
        variant={dialogConfig.variant}
      />
    </div>
  );
};
