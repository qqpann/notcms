export type Properties = Record<
  string,
  "string" | "number" | "date" | "boolean" | "string[]"
>;

export type Schema = Record<string, { id: string; properties: Properties }>;

export type Page<T> = Prettify<{
  id: string;
  title: string;
  properties: T;
  content: string;
}>;

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
  "string[]": string[];
};
/** Make the hover overlay more readable */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
