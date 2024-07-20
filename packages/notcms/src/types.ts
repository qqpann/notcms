export type Properties = Record<
  string,
  'string' | 'number' | 'date' | 'boolean'
>;

export type PageProperties = Record<
  string,
  { id: string; properties: Properties }
>;

/** Utility type to map property string to their corresponding types */
export type InferProperties<T extends Properties> = Prettify<MapProperties<T>>;
type MapProperties<T extends Properties> = {
  [K in keyof T]: T[K] extends keyof PropertyTypeMap
    ? PropertyTypeMap[T[K]]
    : never;
};
type PropertyTypeMap = {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
};
/** Make the hover overlay more readable */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
