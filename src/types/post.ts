export enum PostCategory {
  NOTICE = 'NOTICE', // 공지사항
  QNA = 'QNA', // 질의응답
  TIP = 'TIP', // 정보
  MEETUP = 'MEETUP', // 모임
  FREE = 'FREE', // 자유
}

export const PostCategoryLabels: Record<PostCategory, string> = {
  [PostCategory.NOTICE]: '공지사항',
  [PostCategory.QNA]: '질의응답',
  [PostCategory.TIP]: '정보',
  [PostCategory.MEETUP]: '모임',
  [PostCategory.FREE]: '자유',
};

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

export interface PostDto {
  postId: number;
  userId: number;
  nickname: string;
  category: PostCategory;
  title: string;
  content: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentDto {
  commentId: number;
  postId: number;
  userId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  posts: PostDto[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CreatePostRequest {
  category: PostCategory;
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  category: PostCategory;
  title: string;
  content: string;
}

export interface VoteRequest {
  voteType: VoteType;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}
