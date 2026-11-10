import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../lib/site';

export async function GET() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return rss({
    title: 'Michael Dadi — Engineering notes',
    description: site.description,
    site: site.url,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: `/writing/${article.id}/`,
    })),
  });
}
