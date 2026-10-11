/**
 * Runtime list of supported property types.
 * Single source of truth for both the `Properties` type and
 * runtime validation (e.g. CLI schema pull).
 */
export const PROPERTY_TYPES = [
  // boolean
  "checkbox",
  // number
  "number",
  // string
  "select",
  "title",
  "url",
  "created_by",
  "last_edited_by",
  "email",
  "phone_number",
  "rich_text",
  "status",
  "unique_id",
  "formula",
  // string (Date)
  "date",
  "created_time",
  "last_edited_time",
  // string (unsupported)
  "rollup",
  // string[]
  "multi_select",
  "files",
  "people",
  "relation",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type Properties = Record<string, PropertyType>;

export type PropertyOptions = Record<string, readonly string[]>;
export type Schema = Record<
  string,
  { id: string; properties: Properties; options?: PropertyOptions }
>;

export type InferDatabaseProperties<T extends Schema[string]> = InferProperties<
  T["properties"],
  T extends { options: infer O extends PropertyOptions } ? O : {}
>;

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
export type InferProperties<
  T extends Properties,
  O extends PropertyOptions = {},
> = Prettify<MapProperties<T, O>>;
type MapProperties<T extends Properties, O extends PropertyOptions> = {
  [K in keyof T]: K extends keyof O
    ? T[K] extends "select" | "status"
      ? O[K][number] | null
      : T[K] extends "multi_select"
        ? O[K][number][] | null
        : PropertyTypeMap[T[K]]
    : PropertyTypeMap[T[K]];
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
  formula: string | number | null;
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
