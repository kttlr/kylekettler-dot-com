import * as prismic from '@prismicio/client';

export const apiEndpoint = 'https://kylekettler.cdn.prismic.io/api/v2';

const client = prismic.createClient(apiEndpoint);

export async function getPage(slug: string) {
  return await client.getByUID('page', slug);
}

export async function getAllPosts() {
  return await client.getAllByType('post')
}
