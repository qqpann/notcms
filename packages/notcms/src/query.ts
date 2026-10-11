import type {
  InferProperties,
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
type Condition<TType extends PropertyType, TValue> =
  | EmptyCondition
  | (TType extends "date" | "created_time" | "last_edited_time"
      ? DateCondition
      : TType extends "multi_select"
        ? { contains: TValue extends readonly (infer E)[] ? E : never }
        : TType extends "files" | "people" | "relation" | "rollup"
          ? never
          : Equality<TValue>);

/** Conditions on different properties are combined with AND. */
export type Where<TDatabase extends Schema[string]> = {
  [K in keyof TDatabase["properties"] | "id"]?:
    | (K extends "id" ? { in: readonly string[] } : never)
    | (K extends keyof TDatabase["properties"]
        ? Condition<
            TDatabase["properties"][K],
            NonNullable<InferProperties<TDatabase["properties"]>[K]>
          >
        : never);
};

type SortableKeys<T extends Properties> = {
  [K in keyof T]: T[K] extends "multi_select" | "files" | "people" | "relation"
    ? never
    : K;
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
