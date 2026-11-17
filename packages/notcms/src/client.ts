import type { ListInclude, ListOptions, ListPagesOptions } from "./query";
import { routes } from "./routes";
import type { InferDatabaseProperties, Page, Pages, Schema } from "./types";
import { getEnv } from "./utils/env";

/**
 * The tuple every query resolves to: the data on success, or the error.
 *
 * Query methods declare it as their return type so that the published
 * declaration file refers to the named property types. When the return type is
 * inferred, the declaration emitter expands those types and leaves an
 * unresolved type parameter, which turns select, status and multi_select values
 * into `any` for package users.
 */
type QueryResult<T> =
  | readonly [T, null, Response]
  | readonly [undefined, Error, Response | undefined];

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
  private async fetch<T>(
    createUrl: () => string | URL,
    method: string
  ): Promise<QueryResult<T>> {
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
   * Pages omit `content` unless `include: ["content"]` is passed, which returns
   * each page's Markdown content in the same request.
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
  list<const TInclude extends readonly ListInclude[] = []>(
    options?: ListPagesOptions<TDatabase, TInclude>
  ): Promise<
    QueryResult<
      "content" extends TInclude[number]
        ? Page<InferDatabaseProperties<TDatabase>>[]
        : Pages<InferDatabaseProperties<TDatabase>>
    >
  > {
    return this.fetch<
      "content" extends TInclude[number]
        ? Page<InferDatabaseProperties<TDatabase>>[]
        : Pages<InferDatabaseProperties<TDatabase>>
    >(() => {
      const url = this.pagesUrl(options);
      if (options?.include?.includes("content")) {
        url.searchParams.set("include", "content");
      }
      return url.toString();
    }, "GET");
  }

  /**
   * Retrieve the first matching page, including content, or null when none match.
   * Uses the same filters and ordering as list() in a single request
   * (`limit=1&include=content`), so content comes from the synchronized data
   * that list() reads. Errors retain the usual error tuple and response.
   */
  async getFirst(
    options?: ListOptions<TDatabase>
  ): Promise<QueryResult<Page<InferDatabaseProperties<TDatabase>> | null>> {
    const [pages, error, response] = await this.fetch<
      Page<InferDatabaseProperties<TDatabase>>[]
    >(() => {
      const url = this.pagesUrl(options);
      url.searchParams.set("include", "content");
      url.searchParams.set("limit", "1");
      return url.toString();
    }, "GET");
    if (error !== null) return [undefined, error, response] as const;
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
  get(
    pageId: string
  ): Promise<QueryResult<Page<InferDatabaseProperties<TDatabase>>>> {
    return this.fetch<Page<InferDatabaseProperties<TDatabase>>>(
      () => routes.page(this.workspaceId, this.databaseId, pageId),
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
    // The generated schema module creates the client when it is imported, so
    // these errors often surface in a deployment that lacks the variables.
    // Name the variable to set there.
    if (!secretKey) {
      throw new Error(
        "secretKey is required. Set the NOTCMS_SECRET_KEY environment variable, or pass secretKey to new Client()."
      );
    }
    if (!workspaceId) {
      throw new Error(
        "workspaceId is required. Set the NOTCMS_WORKSPACE_ID environment variable, or pass workspaceId to new Client()."
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
