export type Properties = Record<
  string,
  'string' | 'number' | 'date' | 'boolean'
>;

export type PageProperties = Record<
  string,
  { id: string; properties: Properties }
>;

// Infer the page property types from the pageProperties object
// e.g. { properties: { slug: 'string', publishedAt: 'date' } } => { slug: string, publishedAt: Date }
export type InferProperties<TProperties extends Properties> = {
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
