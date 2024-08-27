import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  blog: {
    id: "01J64GZCM04773JK58TNTR9XNH",
    properties: {
      writer: "string",
      thumbnail: "string[]",
      category: "string",
      categories: "string[]",
      tags: "string[]",
      created_at: "date",
      published: "boolean",
      description: "string",
      title: "string",
    },
  },
  service: {
    id: "01J6A6NTZZNEVGCTYMYWG4P5XW",
    properties: {
      slug: "string",
      lang: "string",
      title: "string",
    },
  },
} satisfies Schema;

export const nc = new Client({ schema });
