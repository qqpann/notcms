export type Properties = Record<
  string,
  // boolean
  | "checkbox"
  // number
  | "number"
  // string
  | "select"
  | "title"
  | "url"
  | "created_by"
  | "last_edited_by"
  | "email"
  | "phone_number"
  | "rich_text"
  | "status"
  | "unique_id"
  | "formula"
  // string (Date)
  | "date"
  | "created_time"
  | "last_edited_time"
  // string (unsupported)
  | "rollup"
  // string[]
  | "multi_select"
  | "files"
  | "people"
  | "relation"
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
  // boolean
  checkbox: boolean | null;
  // number
  number: number | null;
  // string
  select: string | null;
  title: string | null;
  url: string | null;
  created_by: string | null;
  last_edited_by: string | null;
  email: string | null;
  phone_number: string | null;
  rich_text: string | null;
  status: string | null;
  unique_id: string | null;
  formula: string | null;
  //  string (Date)
  date: string | null;
  created_time: string | null;
  last_edited_time: string | null;
  //  string (unsupported)
  rollup: string | null;
  //  string[]
  multi_select: string[] | null;
  files: string[] | null;
  people: string[] | null;
  relation: string[] | null;
};
/** Make the hover overlay more readable */
type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
