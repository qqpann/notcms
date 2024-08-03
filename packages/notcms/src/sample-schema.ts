import type { Schema } from './types';

export const schema = {
  abc: {
    id: 'abc',
    properties: {
      slug: 'string',
      publishedAt: 'date',
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
