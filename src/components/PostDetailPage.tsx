import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { getPostById, deletePost, votePost, unvotePost } from '../api/post';
import {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../api/comment';
import { PostDto, CommentDto, PostCategoryLabels, VoteType } from '../types/post';
import { formatDateTime } from '../utils/dateFormat';

export const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const userId = localStorage.getItem('userId');
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [postId]);

  const fetchPostDetail = async () => {
    try {
      const data = await getPostById(Number(postId));
      setPost(data);
    } catch (error) {
      console.error('게시물 조회 실패:', error);
      alert('게시물을 찾을 수 없습니다.');
      navigate('/community');
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPostId(Number(postId));
      setComments(data);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('정말 이 게시물을 삭제하시겠습니까?')) return;

    try {
      await deletePost(Number(postId));
      alert('게시물이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error('게시물 삭제 실패:', error);
      alert('게시물 삭제에 실패했습니다.');
    }
  };

  const handleVote = async (voteType: VoteType) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await votePost(Number(postId), { voteType });
      fetchPostDetail(); // 추천/비추천 수 업데이트
    } catch (error) {
      console.error('투표 실패:', error);
      alert('투표에 실패했습니다.');
    }
  };

  const handleCreateComment = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await createComment(Number(postId), { content: newComment });
      setNewComment('');
      fetchComments();
      fetchPostDetail(); // 댓글 수 업데이트
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleEditComment = (comment: CommentDto) => {
    setEditingCommentId(comment.commentId);
    setEditingContent(comment.content);
  };

  const handleSaveComment = async (commentId: number) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await updateComment(commentId, { content: editingContent });
      setEditingCommentId(null);
      setEditingContent('');
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
      fetchComments();
      fetchPostDetail(); // 댓글 수 업데이트
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-[#8B9DA9]">로딩 중...</div>
      </div>
    );
  }

  const isAuthor = userId && post.userId.toString() === userId;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-2 text-[#8B9DA9] hover:text-[#0D1B2A] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>

        {/* 게시물 내용 */}
        <div className="bg-white rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-[#16E0B4]/10 text-[#16E0B4] text-sm font-medium rounded-lg mb-3">
                {PostCategoryLabels[post.category]}
              </span>
              <h1 className="text-3xl font-bold text-[#0D1B2A] mb-4">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-[#8B9DA9]">
                <span>{post.nickname}</span>
                <span>{formatDateTime(post.createdAt)}</span>
                {post.updatedAt !== post.createdAt && (
                  <span>(수정됨)</span>
                )}
              </div>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/community/edit/${post.postId}`)}
                  className="p-2 text-[#8B9DA9] hover:text-[#16E0B4] hover:bg-[#F5F7FA] rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeletePost}
                  className="p-2 text-[#8B9DA9] hover:text-red-500 hover:bg-[#F5F7FA] rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-[#0D1B2A] whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* 추천/비추천 */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#E1E8ED]">
            <button
              onClick={() => handleVote(VoteType.UPVOTE)}
              className="flex items-center gap-2 px-6 py-3 bg-[#16E0B4]/10 text-[#16E0B4] rounded-xl hover:bg-[#16E0B4]/20 transition-colors"
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="font-semibold">{post.upvoteCount}</span>
            </button>
            <button
              onClick={() => handleVote(VoteType.DOWNVOTE)}
              className="flex items-center gap-2 px-6 py-3 bg-[#8B9DA9]/10 text-[#8B9DA9] rounded-xl hover:bg-[#8B9DA9]/20 transition-colors"
            >
              <ThumbsDown className="w-5 h-5" />
              <span className="font-semibold">{post.downvoteCount}</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-[#16E0B4]" />
            <h2 className="text-xl font-bold text-[#0D1B2A]">
              댓글 {post.commentCount}
            </h2>
          </div>

          {/* 댓글 작성 */}
          {isLoggedIn && (
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="w-full p-4 rounded-xl border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCreateComment}
                  className="px-6 py-2 bg-[#16E0B4] text-white rounded-xl font-semibold hover:bg-[#12c9a0] transition-colors"
                >
                  댓글 작성
                </button>
              </div>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-[#8B9DA9]">
                첫 댓글을 작성해보세요
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="p-4 bg-[#F5F7FA] rounded-xl"
                >
                  {editingCommentId === comment.commentId ? (
                    <div>
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full p-3 rounded-lg border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none resize-none mb-2"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="px-4 py-2 text-[#8B9DA9] hover:bg-white rounded-lg"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleSaveComment(comment.commentId)}
                          className="px-4 py-2 bg-[#16E0B4] text-white rounded-lg hover:bg-[#12c9a0]"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold text-[#0D1B2A]">
                            {comment.nickname}
                          </span>
                          <span className="text-sm text-[#8B9DA9] ml-3">
                            {formatDateTime(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt &&
                              ' (수정됨)'}
                          </span>
                        </div>

                        {userId &&
                          comment.userId.toString() === userId && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="p-1 text-[#8B9DA9] hover:text-[#16E0B4]"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComment(comment.commentId)
                                }
                                className="p-1 text-[#8B9DA9] hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                      </div>
                      <p className="text-[#0D1B2A] whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
