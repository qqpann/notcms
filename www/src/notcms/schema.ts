import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  blog: {
    id: "01J8XTSD2SCRXRQ0XWTMB5NB2B",
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
  writers: {
    id: "01J8XTSRH2C5PDE0H0XKFZZKXN",
    properties: {
      image: "string[]",
      名前: "string",
    },
  },
} satisfies Schema;

export const nc = new Client({ schema });
