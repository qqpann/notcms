import type { Schema } from "../src/types";

export const schema = {
  abc: {
    id: "abc",
    properties: {
      slug: "rich_text",
      publishedAt: "date",
      categories: "select",
    },
  },
  "1def": {
    id: "1def",
    properties: {
      slug: "rich_text",
      category: "number",
    },
  },
} satisfies Schema;
