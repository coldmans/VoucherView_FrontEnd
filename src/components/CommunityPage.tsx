import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MessageSquare, ThumbsUp, ThumbsDown, PenSquare } from 'lucide-react';
import { getPostList } from '../api/post';
import {
  PostDto,
  PostCategory,
  PostCategoryLabels,
  PostListResponse,
} from '../types/post';
import { formatDate } from '../utils/dateFormat';

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [postList, setPostList] = useState<PostDto[]>([]);
  const [pagination, setPagination] = useState<PostListResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 필터 및 검색 상태
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | undefined>(
    (searchParams.get('category') as PostCategory) || undefined
  );
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [sortBy, setSortBy] = useState<'latest' | 'upvote'>(
    (searchParams.get('sortBy') as 'latest' | 'upvote') || 'latest'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, sortBy, currentPage]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await getPostList({
        page: currentPage,
        limit: 20,
        category: selectedCategory,
        keyword: keyword || undefined,
        sortBy,
      });
      setPostList(response.posts);
      setPagination(response.pagination);
    } catch (error) {
      console.error('게시물 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPosts();

    // URL 업데이트
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (keyword) params.keyword = keyword;
    if (sortBy !== 'latest') params.sortBy = sortBy;
    setSearchParams(params);
  };

  const handleCategoryClick = (category: PostCategory | undefined) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-3 md:px-4">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D1B2A]">커뮤니티</h1>
          {isLoggedIn && (
            <button
              onClick={() => navigate('/community/write')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#16E0B4] text-white rounded-xl font-semibold hover:bg-[#12c9a0] transition-colors text-sm md:text-base"
            >
              <PenSquare className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">글쓰기</span>
              <span className="sm:hidden">글쓰기</span>
            </button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !selectedCategory
                ? 'bg-[#16E0B4] text-white'
                : 'bg-white text-[#8B9DA9] hover:bg-[#E1E8ED]'
            }`}
          >
            전체
          </button>
          {Object.entries(PostCategoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key as PostCategory)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-[#16E0B4] text-white'
                  : 'bg-white text-[#8B9DA9] hover:bg-[#E1E8ED]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 검색 및 정렬 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B9DA9]" />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none text-sm md:text-base"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 sm:flex-none px-6 py-3 bg-[#16E0B4] text-white rounded-xl font-semibold hover:bg-[#12c9a0] transition-colors text-sm md:text-base"
            >
              검색
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'upvote')}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl border-2 border-[#E1E8ED] focus:border-[#16E0B4] focus:outline-none text-sm md:text-base"
            >
              <option value="latest">최신순</option>
              <option value="upvote">추천순</option>
            </select>
          </div>
        </div>

        {/* 게시물 목록 */}
        {isLoading ? (
          <div className="text-center py-20 text-[#8B9DA9]">로딩 중...</div>
        ) : postList.length === 0 ? (
          <div className="text-center py-20 text-[#8B9DA9]">
            게시물이 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {postList.map((post) => (
              <div
                key={post.postId}
                onClick={() => navigate(`/community/${post.postId}`)}
                className="bg-white rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                    <span className="px-3 py-1 bg-[#16E0B4]/10 text-[#16E0B4] text-xs md:text-sm font-medium rounded-lg w-fit">
                      {PostCategoryLabels[post.category]}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-[#0D1B2A]">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <p className="text-[#8B9DA9] mb-4 line-clamp-2 text-sm md:text-base">
                  {post.content}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs md:text-sm text-[#8B9DA9]">
                  <div className="flex items-center gap-3 md:gap-4">
                    <span>{post.nickname}</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.upvoteCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{post.downvoteCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 md:gap-2 mt-6 md:mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 rounded-lg bg-white text-[#8B9DA9] hover:bg-[#E1E8ED] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              이전
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base ${
                    currentPage === page
                      ? 'bg-[#16E0B4] text-white'
                      : 'bg-white text-[#8B9DA9] hover:bg-[#E1E8ED]'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 md:px-4 py-2 rounded-lg bg-white text-[#8B9DA9] hover:bg-[#E1E8ED] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
