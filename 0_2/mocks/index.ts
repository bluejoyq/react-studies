import { rest } from 'msw';
import { setupWorker } from 'msw';

interface Post {
  id: number;
  title: string;
  body: string;
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const genDemoPost = (page: number): Post => {
  return {
    id: page,
    title: `Post ${page}`,
    body: `This is the body of post ${page}`,
  };
};
const handlers = [
  rest.get('/posts', async (req, res, ctx) => {
    const { url } = req;
    const offset = Number(url.searchParams.get('offset')) ?? 0;

    await sleep(1000);
    if (offset > 50) {
      return res(
        ctx.json({
          data: [],
          nextPage: null,
        })
      );
    }
    return res(
      ctx.json({
        data: new Array(10).fill(0).map((_, i) => genDemoPost(i + offset)),
        nextPage: offset + 10,
      })
    );
  }),
];

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);
