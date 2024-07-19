type Properties = Record<string, 'string' | 'number' | 'date' | 'boolean'>;
export type PageProperties = Record<
  string,
  { id: string; properties: Properties }
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
      category: 'number',
    },
  },
} satisfies PageProperties;

// Infer the page property types from the pageProperties object
// e.g. { properties: { slug: 'string', publishedAt: 'date' } } => { slug: string, publishedAt: Date }
type InferProperties<TProperties extends Properties> = {
  [Key in keyof TProperties]: TProperties[Key] extends 'string'
    ? string
    : TProperties[Key] extends 'number'
    ? number
    : TProperties[Key] extends 'date'
    ? Date
    : TProperties[Key] extends 'boolean'
    ? boolean
    : TProperties[Key] extends 'string[]'
    ? string[]
    : TProperties[Key] extends 'number[]'
    ? number[]
    : TProperties[Key] extends 'date[]'
    ? Date[]
    : TProperties[Key] extends 'boolean[]'
    ? boolean[]
    : never;
};
const tmp = pageProperties['abc']['properties'];
type _A = typeof tmp;
type A = InferProperties<typeof tmp>;
