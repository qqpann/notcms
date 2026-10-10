import type { Client, InferProperties, Pages } from "notcms";
import type { schema } from "./schema";

export type Locale = "ja" | "en";
type BlogProperties = InferProperties<typeof schema.blog.properties>;
type ReleaseProperties = InferProperties<typeof schema.releases.properties>;
export type BlogPost = Pages<BlogProperties>[number];
export type Release = Pages<ReleaseProperties>[number];

function matchesLanguage(language: string | null, locale: Locale): boolean {
  // Missing language belongs to Japanese only. Other values stay excluded.
  return (language === null || language === "" ? "ja" : language) === locale;
}

function publishedAt(value: string | null, now: Date): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= now.getTime()
    ? timestamp
    : null;
}

export function selectBlogPosts(
  posts: BlogPost[],
  locale: Locale,
  now: Date
): BlogPost[] {
  return posts
    .filter(
      (post) =>
        post.properties.published === true &&
        publishedAt(post.properties.published_at, now) !== null &&
        matchesLanguage(post.properties.language, locale)
    )
    .sort(
      (a, b) =>
        Date.parse(b.properties.published_at ?? "") -
          Date.parse(a.properties.published_at ?? "") ||
        a.id.localeCompare(b.id)
    );
}

export function selectReleases(
  releases: Release[],
  locale: Locale,
  now: Date
): Release[] {
  return releases
    .filter(
      (release) =>
        publishedAt(release.properties.released_at, now) !== null &&
        matchesLanguage(release.properties.language, locale)
    )
    .sort(
      (a, b) =>
        Date.parse(b.properties.released_at ?? "") -
          Date.parse(a.properties.released_at ?? "") || a.id.localeCompare(b.id)
    );
}

// ID URLs work without slug/version and stay distinct across products.
export function contentUrl(
  kind: "blog" | "releases",
  locale: Locale,
  id: string
): string {
  return `/${locale}/${kind}/${encodeURIComponent(id)}`;
}

/** Call on the server with your generated nc client; never expose its key. */
export function createContentReader(nc: Client<typeof schema>) {
  async function listBlog(locale: Locale, now: Date = new Date()) {
    const [posts, error] = await nc.query.blog.list();
    if (error) throw error;
    return selectBlogPosts(posts, locale, now);
  }

  async function listReleases(locale: Locale, now: Date = new Date()) {
    const [releases, error] = await nc.query.releases.list();
    if (error) throw error;
    return selectReleases(releases, locale, now);
  }

  async function getBlog(id: string, locale: Locale, now: Date = new Date()) {
    if (!(await listBlog(locale, now)).some((post) => post.id === id))
      return null;
    const [post, error] = await nc.query.blog.get(id);
    if (error) throw error;
    // Detail fetch may return a newer publication state than the list.
    return selectBlogPosts([post], locale, now).length > 0 ? post : null;
  }

  async function getRelease(
    id: string,
    locale: Locale,
    now: Date = new Date()
  ) {
    if (!(await listReleases(locale, now)).some((release) => release.id === id))
      return null;
    const [release, error] = await nc.query.releases.get(id);
    if (error) throw error;
    return selectReleases([release], locale, now).length > 0 ? release : null;
  }

  return { listBlog, listReleases, getBlog, getRelease };
}
