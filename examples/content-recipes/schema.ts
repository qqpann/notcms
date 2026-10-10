import type { Schema } from "notcms";

// Sample shape only. Replace with the schema generated from your own databases.
export const schema = {
  blog: {
    id: "sample_blog",
    properties: {
      title: "title",
      published: "checkbox",
      published_at: "date",
      language: "select",
    },
  },
  releases: {
    id: "sample_releases",
    properties: {
      title: "title",
      released_at: "date",
      language: "select",
      products: "multi_select",
      version_number: "rich_text",
    },
  },
} satisfies Schema;
