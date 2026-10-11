import type { ListOptions } from "./query";
import { routes } from "./routes";
import type { InferProperties, Page, Pages, Schema } from "./types";
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
  declare readonly $inferPage: Page<InferProperties<TDatabase["properties"]>>;
  declare readonly $inferPages: Pages<InferProperties<TDatabase["properties"]>>;

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
   * @returns {Promise<[Pages<InferProperties<TDatabase["properties"]>>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Pages<InferProperties<TDatabase["properties"]>>, null, Response]` on success, where:
   *      - `Pages<InferProperties<TDatabase["properties"]>>`: The retrieved pages data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  list(options?: ListOptions<TDatabase>) {
    return this.fetch<Pages<InferProperties<TDatabase["properties"]>>>(() => {
      const url = new URL(routes.pages(this.workspaceId, this.databaseId));
      if (options?.where !== undefined) {
        url.searchParams.set("filter", JSON.stringify(options.where));
      }
      if (options?.sort !== undefined) {
        url.searchParams.set("sort", JSON.stringify(options.sort));
      }
      return url.toString();
    }, "GET");
  }

  /**
   * Retrieves a page from the database.
   *
   * @template TDatabase - The database schema.
   * @param {string} pageId - The ID of the page to retrieve.
   * @returns {Promise<[Page<InferProperties<TDatabase["properties"]>>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Page<InferProperties<TDatabase["properties"]>>, null, Response]` on success, where:
   *      - `Page<InferProperties<TDatabase["properties"]>>`: The retrieved page data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  get(pageId: string) {
    return this.fetch<Page<InferProperties<TDatabase["properties"]>>>(
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
