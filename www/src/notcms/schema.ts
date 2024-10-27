import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  writers: {
    id: "01J8XTSRH2C5PDE0H0XKFZZKXN",
    properties: {
      image: "string[]",
      名前: "string",
    },
  },
  blog: {
    id: "01JB6DJN8BW8Z3FNX165F67PPB",
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
