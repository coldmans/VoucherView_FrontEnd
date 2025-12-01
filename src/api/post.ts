import { apiClient } from '../utils/apiClient';
import type {
  PostDto,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  VoteRequest,
  PostCategory,
} from '../types/post';

/**
 * 게시물 작성
 */
export const createPost = async (
  data: CreatePostRequest
): Promise<PostDto> => {
  return apiClient.post('/api/posts', data, true);
};

/**
 * 게시물 목록 조회
 */
export const getPostList = async (params: {
  page?: number;
  limit?: number;
  category?: PostCategory;
  keyword?: string;
  sortBy?: 'latest' | 'upvote';
}): Promise<PostListResponse> => {
  return apiClient.get('/api/posts', params, false);
};

/**
 * 게시물 상세 조회
 */
export const getPostById = async (postId: number): Promise<PostDto> => {
  return apiClient.get(`/api/posts/${postId}`);
};

/**
 * 게시물 수정
 */
export const updatePost = async (
  postId: number,
  data: UpdatePostRequest
): Promise<void> => {
  await apiClient.put(`/api/posts/${postId}`, data, true);
};

/**
 * 게시물 삭제
 */
export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete(`/api/posts/${postId}`, true);
};

/**
 * 게시물 추천/비추천
 */
export const votePost = async (
  postId: number,
  data: VoteRequest
): Promise<{ message: string }> => {
  return apiClient.post(`/api/posts/${postId}/vote`, data, true);
};

/**
 * 게시물 추천/비추천 취소
 */
export const unvotePost = async (postId: number): Promise<void> => {
  await apiClient.delete(`/api/posts/${postId}/vote`, true);
};
