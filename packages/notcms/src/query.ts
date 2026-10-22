import type {
  InferDatabaseProperties,
  KnownPropertyType,
  Properties,
  PropertyType,
  Schema,
} from "./types";

type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> & Partial<T> }[keyof T];
type EmptyCondition = { is_empty: true } | { is_not_empty: true };
type Equality<T> = T | AtLeastOne<{ equals: T; not_equals: T }>;
type DateCondition = AtLeastOne<{
  before: string | Date;
  after: string | Date;
  on_or_before: string | Date;
  on_or_after: string | Date;
}>;
type Condition<TType extends PropertyType, TValue> = [TType] extends [
  KnownPropertyType,
]
  ?
      | EmptyCondition
      | (TType extends "date" | "created_time" | "last_edited_time"
          ? DateCondition
          : TType extends "multi_select"
            ? { contains: TValue extends readonly (infer E)[] ? E : never }
            : TType extends "files" | "people" | "relation" | "rollup"
              ? never
              : Equality<TValue>)
  : never;

type PageIdCondition = { in: readonly string[] } & Partial<
  Record<
    | "equals"
    | "not_equals"
    | "is_empty"
    | "is_not_empty"
    | "contains"
    | "before"
    | "after"
    | "on_or_before"
    | "on_or_after",
    never
  >
>;
type WithoutIdIn<T> = T extends object ? T & { in?: never } : T;

/** Conditions on different properties are combined with AND. */
export type Where<TDatabase extends Schema[string]> = {
  [K in keyof TDatabase["properties"] | "id"]?:
    | (K extends "id" ? PageIdCondition : never)
    | (K extends keyof TDatabase["properties"]
        ? WithoutIdIn<
            Condition<
              TDatabase["properties"][K],
              NonNullable<InferDatabaseProperties<TDatabase>[K]>
            >
          >
        : never);
};

type SortableKeys<T extends Properties> = {
  [K in keyof T]: T[K] extends KnownPropertyType
    ? T[K] extends "multi_select" | "files" | "people" | "relation"
      ? never
      : K
    : never;
}[keyof T];

/** Exactly one scalar property; empty values always sort last. */
export type Sort<TDatabase extends Schema[string]> = {
  [K in SortableKeys<TDatabase["properties"]>]: { [P in K]: "asc" | "desc" } & {
    [P in Exclude<keyof TDatabase["properties"], K>]?: never;
  };
}[SortableKeys<TDatabase["properties"]>];

export type ListOptions<TDatabase extends Schema[string]> = {
  where?: Where<TDatabase>;
  sort?: Sort<TDatabase>;
};
