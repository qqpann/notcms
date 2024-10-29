import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  writers: {
    id: "1703046e27044db385b3087d02437cc8",
    properties: {
      image: "string[]",
      名前: "string",
    },
  },
  blog: {
    id: "cb962fce05b44e57b4ffdc0f1f93e96d",
    properties: {
      writer: "string",
      thumbnail: "string[]",
      category: "string",
      writers: "string[]",
      categories: "string[]",
      created_at: "date",
      published: "boolean",
      tags: "string[]",
      description: "string",
      title: "string",
    },
  },
} satisfies Schema;
export const nc = new Client({ schema });
