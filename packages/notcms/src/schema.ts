import { InferProperties, PageProperties, Properties } from './types';

export const pageProperties = {
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
} satisfies PageProperties;

const tmp = pageProperties['abc']['properties'];
type _A = typeof tmp;
type A = InferProperties<typeof tmp>;
