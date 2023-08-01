interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => Promise<void>;
}

type RefCallback = (node: Element | null) => void;

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
}: UseInfiniteScrollProps): RefCallback => {
  return () => {
    return;
  };
};
