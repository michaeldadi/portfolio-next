import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface BlogResponse {
  posts: BlogPost[];
  nextCursor?: string;
  hasMore: boolean;
}

export const useBlogPosts = () => {
  return useInfiniteQuery({
    queryKey: ['blog-posts'],
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<BlogResponse>('/blog/posts', {
        params: { cursor: pageParam, limit: 10 },
      });
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor,
  });
};
