import { ReactElement } from 'react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { useInfiniteQuery } from '@tanstack/react-query';
interface Post {
  id: number;
  title: string;
  body: string;
}
export const App = (): ReactElement => {
  const {
    data: posts,
    fetchNextPage,
    isLoading,
    hasNextPage,
  } = useInfiniteQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`posts?offset=${pageParam}`);
      const body = await res.json();
      return body.data as Post[];
    },
    getNextPageParam: (lastPage) => {
      return lastPage[lastPage.length - 1].id + 1;
    },
  });
  const ref = useInfiniteScroll({
    onLoadMore: async () => {
      await fetchNextPage();
    },
    loading: isLoading,
    hasMore: hasNextPage ?? true,
  });
  return (
    <div
      css={{
        width: '100vw',
        backgroundColor: 'gray',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {(posts?.pages.flat() ?? []).map((post) => (
        <div
          key={post.id}
          css={{
            width: '100%',
            height: '100px',
          }}
        >
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      ))}
      <div
        ref={ref}
        css={{
          width: '100%',
          height: '50px',
          backgroundColor: 'red',
        }}
      >
        sentry
      </div>
    </div>
  );
};
