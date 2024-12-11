import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = {
  templates: {
    id: "1092c5fe-b55c-80cb-835c-c6ffb4100f2b",
    properties: {
      preview: "url",
      deploy_with_vercel: "url",
      use_case: "select",
      language: "select",
      published: "checkbox",
      framework: "select",
      github: "url",
      description: "rich_text",
      css: "select",
      notion_template: "url",
      thumbnails: "files",
      images: "files",
      title: "title",
    },
  },
  writers: {
    id: "1703046e27044db385b3087d02437cc8",
    properties: {
      images: "files",
      name: "title",
    },
  },
  service: {
    id: "c6a73cf405aa430a9f93cfb6851fcd24",
    properties: {
      slug: "rich_text",
      lang: "select",
      title: "title",
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
