/**
 * Runtime list of supported property types.
 * Known value types. Schemas also retain unrecognized type names so a new
 * Notion property type cannot prevent using the other database properties.
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

export type KnownPropertyType = (typeof PROPERTY_TYPES)[number];

export type PropertyType = KnownPropertyType | (string & Record<never, never>);

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
        : PropertyValue<T[K]>
    : PropertyValue<T[K]>;
};
type PropertyValue<T extends PropertyType> = T extends keyof PropertyTypeMap
  ? PropertyTypeMap[T]
  : unknown;
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

/** Saved measurements: unknown is not evidence of completeness or failure. */
export type SyncCompleteness = "unknown" | "complete" | "partial" | "failed";
export type SyncDiagnosticStage =
  | "discovery"
  | "page"
  | "properties"
  | "content"
  | "media";

/** Fixed, content-free codes returned by the quality endpoint. */
export type SyncDiagnosticCode =
  | "unknown_sync_failure"
  | "notion_unauthorized"
  | "notion_credentials_unavailable"
  | "notion_access_denied"
  | "notion_not_found_or_inaccessible"
  | "notion_rate_limited"
  | "notion_unavailable"
  | "notion_timeout"
  | "notion_conflict"
  | "notion_invalid_request"
  | "notion_unsupported_property"
  | "notion_unsupported_formula"
  | "notion_unsupported_rollup"
  | "notion_unsupported_block"
  | "notion_block_pagination_incomplete"
  | "notion_block_children_cycle"
  | "notion_property_items_expected_list"
  | "notion_property_items_unexpected_type"
  | "notion_property_pagination_missing_cursor"
  | "notion_enumeration_incomplete"
  | "notion_enumeration_unexpected_cursor"
  | "notion_enumeration_missing_cursor"
  | "notion_enumeration_cursor_cycle"
  | "notion_zero_data_sources"
  | "notion_multiple_data_sources"
  | "media_not_measured"
  | "media_external_unverified"
  | "media_not_persisted"
  | "media_source_expired"
  | "media_source_unverified"
  | "media_result_unavailable"
  | "media_upload_failed"
  | "media_enqueue_failed"
  | "media_storage_limit"
  | "media_lease_expired"
  | "sync_work_in_progress"
  | "sync_page_lease_expired";

export type SyncDiagnostic = {
  version: 1;
  stage: SyncDiagnosticStage;
  code: SyncDiagnosticCode;
  retryability: "retryable" | "not_retryable" | "unknown";
  action: "retry" | "check_access" | "reconnect" | "review_source" | "wait";
};

/** The persisted fetch report; current media state is in MediaQuality. */
export type PageSyncReport = {
  version: 1;
  properties: SyncCompleteness;
  content: SyncCompleteness;
  media: "unknown";
  /** Absent on legacy reports. A zero-reference count alone is not complete. */
  mediaEnumeration?: { properties: boolean; content: boolean };
  diagnostic: SyncDiagnostic | null;
  /** Optional on legacy version-1 reports. */
  diagnostics?: SyncDiagnostic[];
};

export type MediaStatus =
  | "ready"
  | "pending"
  | "failed"
  | "unknown"
  | "unpersisted"
  | "expired";

export type MediaQuality = {
  status: MediaStatus;
  enumerated: boolean;
  counts: Record<MediaStatus | "total", number>;
  diagnostics: SyncDiagnostic[];
};

export type DimensionQuality = {
  /** The version actually served for this dimension, including a locked copy. */
  version: string | null;
  completeness: SyncCompleteness;
  diagnostics: SyncDiagnostic[];
  media: MediaQuality;
};

export type PageCopyQuality = {
  properties: DimensionQuality;
  content: DimensionQuality;
  media: MediaQuality;
};

export type PageQuality = {
  /** Null when no published copy exists, including a failed initial fetch. */
  published: PageCopyQuality | null;
  latestAttempt:
    | (PageCopyQuality & {
        version: string;
        revision: number;
        /** ISO 8601 timestamp. */
        startedAt: string;
        /** ISO 8601 timestamp; null while this attempt is unfinished. */
        finishedAt: string | null;
        report: PageSyncReport | null;
      })
    | null;
};
