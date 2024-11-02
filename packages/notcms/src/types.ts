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
export type Pages<T> = Prettify<{
  id: string;
  title: string;
  properties: T;
  // no content
}>[];

/** Utility type to map property string to their corresponding types */
export type InferProperties<T extends Properties> = Prettify<MapProperties<T>>;
type MapProperties<T extends Properties> = {
  [K in keyof T]: T[K] extends keyof PropertyTypeMap
    ? PropertyTypeMap[T[K]]
    : never;
};
type PropertyTypeMap = {
  string: string | undefined;
  number: number | undefined;
  // TODO: convert date string to Date object
  // date: Date | undefined;
  date: string | undefined;
  boolean: boolean | undefined;
  "string[]": string[] | undefined;
};
/** Make the hover overlay more readable */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
