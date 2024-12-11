import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  writers: {
    id: "1703046e27044db385b3087d02437cc8",
    properties: {
      images: "files",
      name: "title",
    },
  },
  blog: {
    id: "cb962fce05b44e57b4ffdc0f1f93e96d",
    properties: {
      thumbnails: "files",
      category: "select",
      updated_at: "last_edited_time",
      writers: "relation",
      created_at: "created_time",
      published: "checkbox",
      tags: "multi_select",
      description: "rich_text",
      title: "title",
    },
  },
} satisfies Schema;
export const nc = new Client({ schema });
