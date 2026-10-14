import { Client, type Schema } from "notcms";

// Compile-time fixture for the illustrative blog schema in the core guides.
// The documentation checker never executes this module or its API calls.
export const schema = {
  blog: {
    id: "example-blog",
    properties: {
      title: "title",
      published: "checkbox",
      slug: "rich_text",
    },
  },
} as const satisfies Schema;

export const nc = new Client({ schema });
