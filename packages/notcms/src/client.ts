import type { ListOptions } from "./query";
import { routes } from "./routes";
import type {
  InferDatabaseProperties,
  Page,
  PageQuality,
  Pages,
  Schema,
} from "./types";
import { getEnv } from "./utils/env";

class DatabaseHandler<TDatabase extends Schema[string]> {
  constructor(
    private secretKey: string,
    private workspaceId: string,
    private databaseId: string
  ) {}

  /**
   * The inferred page type for this database.
   * Usage example:
   *   type Page = typeof nc.query.blog.$inferPage;
   */
  declare readonly $inferPage: Page<InferDatabaseProperties<TDatabase>>;
  declare readonly $inferPages: Pages<InferDatabaseProperties<TDatabase>>;

  // common function to fetch data
  private async fetch<T>(createUrl: () => string | URL, method: string) {
    let response: Response | undefined;
    try {
      response = await fetch(createUrl(), {
        method,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data. [${response.status} ${response.statusText}]: ${errorText}`
        );
      }

      const { data } = (await response.json()) as { data: T };

      // TODO: check if data is of type T
      // maybe in a test?

      return [data, null, response] as const;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [
        undefined,
        error instanceof Error ? error : Error("Unknown error"),
        response,
      ] as const;
    }
  }

  /**
   * Retrieves a list of pages from the database.
   *
   * @template TDatabase - The database schema.
   * @returns {Promise<[Pages<InferDatabaseProperties<TDatabase>>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Pages<InferDatabaseProperties<TDatabase>>, null, Response]` on success, where:
   *      - `Pages<InferDatabaseProperties<TDatabase>>`: The retrieved pages data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  list(options?: ListOptions<TDatabase>) {
    return this.fetch<Pages<InferDatabaseProperties<TDatabase>>>(
      () => this.pagesUrl(options).toString(),
      "GET"
    );
  }

  /**
   * Retrieve the first matching page, including content, or null when none match.
   * Uses the same filters and ordering as list() in a single request
   * (`limit=1&include=content`), so content comes from the synchronized data
   * that list() reads. Errors retain the usual error tuple and response.
   */
  async getFirst(options?: ListOptions<TDatabase>) {
    const result = await this.fetch<Page<InferDatabaseProperties<TDatabase>>[]>(
      () => {
        const url = this.pagesUrl(options);
        url.searchParams.set("include", "content");
        url.searchParams.set("limit", "1");
        return url.toString();
      },
      "GET"
    );
    const [pages, error, response] = result;
    if (error !== null) return result;
    return [pages.length > 0 ? pages[0] : null, null, response] as const;
  }

  private pagesUrl(options?: ListOptions<TDatabase>) {
    const url = new URL(routes.pages(this.workspaceId, this.databaseId));
    if (options?.where !== undefined) {
      url.searchParams.set("filter", JSON.stringify(options.where));
    }
    if (options?.sort !== undefined) {
      url.searchParams.set("sort", JSON.stringify(options.sort));
    }
    return url;
  }

  /**
   * Retrieves a page from the database.
   *
   * @template TDatabase - The database schema.
   * @param {string} pageId - The ID of the page to retrieve.
   * @returns {Promise<[Page<InferDatabaseProperties<TDatabase>>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Page<InferDatabaseProperties<TDatabase>>, null, Response]` on success, where:
   *      - `Page<InferDatabaseProperties<TDatabase>>`: The retrieved page data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  get(pageId: string) {
    return this.fetch<Page<InferDatabaseProperties<TDatabase>>>(
      () => routes.page(this.workspaceId, this.databaseId, pageId),
      "GET"
    );
  }

  /**
   * Reads saved publication and latest-attempt quality without synchronizing
   * Notion. Returns the usual [data, error, response] tuple. Unknown and legacy
   * measurements are returned unchanged; this never falls back to get().
   */
  quality(pageId: string) {
    return this.fetch<PageQuality>(
      () => routes.pageQuality(this.workspaceId, this.databaseId, pageId),
      "GET"
    );
  }
}

export class Client<TSchema extends Schema> {
  private secretKey: string;
  private workspaceId: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<TSchema[K]>;
  };

  constructor(options?: {
    secretKey?: string;
    workspaceId?: string;
    schema: TSchema;
  }) {
    const secretKey = options?.secretKey || getEnv("NOTCMS_SECRET_KEY");
    const workspaceId = options?.workspaceId || getEnv("NOTCMS_WORKSPACE_ID");
    if (!secretKey) {
      throw new Error(
        "secretKey is required. Pass it as an option or set it as an environment variable."
      );
    }
    if (!workspaceId) {
      throw new Error(
        "workspaceId is required. Pass it as an option or set it as an environment variable."
      );
    }
    this.secretKey = secretKey;
    this.workspaceId = workspaceId;
    this.query = Object.create(null) as {
      [K in keyof TSchema]: DatabaseHandler<TSchema[K]>;
    };
    const schema = options?.schema;
    if (!schema) {
      throw new Error("schema is required.");
    }
    for (const key of Object.keys(schema)) {
      Object.defineProperty(this.query, key, {
        configurable: true,
        enumerable: true,
        value: new DatabaseHandler(
          this.secretKey,
          this.workspaceId,
          schema[key].id
        ),
        writable: true,
      });
    }
  }
}
