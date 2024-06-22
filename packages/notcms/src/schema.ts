export type PageProperties = Record<
  string,
  { id: string; properties: Record<string, string> }
>;
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
      category: 'string',
    },
  },
} satisfies PageProperties;
