import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  blog: {
    id: "01JB76DMRGW7X0ZQF9VY9FEVVE",
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
    id: "01JB76Q6WM10DKQ2VQ9TPQNBJF",
    properties: {
      image: "string[]",
      名前: "string",
    },
  },
} satisfies Schema;
export const nc = new Client({ schema });
