import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  templates: {
    id: "1092c5fe-b55c-80cb-835c-c6ffb4100f2b",
    properties: {
      preview: "string",
      deploy_with_vercel: "string",
      use_case: "string",
      language: "string",
      published: "boolean",
      framework: "string",
      github: "string",
      description: "string",
      css: "string",
      notion_template: "string",
      thumbnails: "string[]",
      images: "string[]",
      title: "string",
    },
  },
  writers: {
    id: "1703046e27044db385b3087d02437cc8",
    properties: {
      images: "string[]",
      name: "string",
    },
  },
  service: {
    id: "c6a73cf405aa430a9f93cfb6851fcd24",
    properties: {
      slug: "string",
      lang: "string",
      title: "string",
    },
  },
  blog: {
    id: "cb962fce05b44e57b4ffdc0f1f93e96d",
    properties: {
      thumbnails: "string[]",
      category: "string",
      updated_at: "date",
      writers: "string[]",
      created_at: "date",
      published: "boolean",
      tags: "string[]",
      description: "string",
      title: "string",
    },
  },
} satisfies Schema;
export const nc = new Client({ schema });
