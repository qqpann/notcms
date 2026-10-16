import type { Schema } from "../../src/types";

// Matches the API schema response: property type names are passed through.
export const unsupportedSchemaResponse = {
  schema: {
    blog: {
      id: "nids_blog",
      properties: {
        title: "title",
        published: "checkbox",
        language: "select",
        action: "button",
        location: "place",
        verified: "verification",
        future: "future_widget",
      },
      options: { language: ["en", "ja"] },
    },
    legacy: { id: "db_legacy", properties: { title: "title" } },
  },
} as const satisfies { schema: Schema };
