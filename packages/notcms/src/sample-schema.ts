import type { Schema } from './types';

export const schema = {
  abc: {
    id: 'abc',
    properties: {
      slug: 'string',
      publishedAt: 'date',
      categories: 'string[]',
    },
  },
  '1def': {
    id: '1def',
    properties: {
      slug: 'string',
      category: 'number',
    },
  },
} satisfies Schema;
