import { apiClient } from '../utils/apiClient';
import type {
  CommentDto,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../types/post';

/**
 * 댓글 목록 조회
 */
export const getCommentsByPostId = async (
  postId: number
): Promise<CommentDto[]> => {
  return apiClient.get(`/api/posts/${postId}/comments`);
};

/**
 * 댓글 작성
 */
export const createComment = async (
  postId: number,
  data: CreateCommentRequest
): Promise<CommentDto> => {
  return apiClient.post(`/api/posts/${postId}/comments`, data, true);
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  commentId: number,
  data: UpdateCommentRequest
): Promise<void> => {
  await apiClient.put(`/api/comments/${commentId}`, data, true);
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  await apiClient.delete(`/api/comments/${commentId}`, true);
};
