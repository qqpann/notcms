export type PageProperties = Record<
  string,
  { id: string; properties: Record<string, string> }
>;
export const pageProperties = {
  '2abc': {
    id: '2abc',
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
