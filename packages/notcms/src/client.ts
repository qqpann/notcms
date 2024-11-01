import { routes } from "./routes";
import type { InferProperties, Page, Pages, Schema } from "./types";

class DatabaseHandler<TData> {
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
  declare readonly $inferPage: Page<TData>;
  declare readonly $inferPages: Pages<TData>;

  // common function to fetch data
  private async fetch<T>(
    url: string | URL | globalThis.Request,
    method: string
    // body?: any
  ) {
    let response: Response | undefined;
    try {
      response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data. [${response.status} ${response.statusText}]: ${errorText}`
        );
      }

      const { data } = (await response.json()) as { data: T };

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
   * @template TData - The type of properties in the page.
   * @returns {Promise<[Pages<TData>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Pages<TData>, null, Response]` on success, where:
   *      - `Pages<TData>`: The retrieved pages data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  listPages() {
    return this.fetch<Pages<TData>>(
      routes.pages(this.workspaceId, this.databaseId),
      "GET"
    );
  }

  /**
   * Retrieves a page from the database.
   *
   * @template TData - The type of properties in the page.
   * @param {string} pageId - The ID of the page to retrieve.
   * @returns {Promise<[Page<TData>, null, Response] | [undefined, Error, Response | undefined]>}
   * - A Promise that resolves to either:
   *    - `[Page<TData>, null, Response]` on success, where:
   *      - `Page<TData>`: The retrieved page data.
   *      - `null`: Indicates no error.
   *      - `Response`: The HTTP response object.
   *    - `[undefined, Error, Response | undefined]` on failure, where:
   *      - `undefined`: No data is returned.
   *      - `Error`: The error encountered.
   *      - `Response | undefined`: The optional HTTP response object.
   */
  getPage(pageId: string) {
    return this.fetch<Page<TData>>(
      routes.page(this.workspaceId, this.databaseId, pageId),
      "GET"
    );
  }
}

export class Client<TSchema extends Schema> {
  private secretKey: string;
  private workspaceId: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<
      InferProperties<TSchema[K]["properties"]>
    >;
  };

  constructor(options?: {
    secretKey?: string;
    workspaceId?: string;
    schema: TSchema;
  }) {
    const secretKey = options?.secretKey || process.env.NOTCMS_SECRET_KEY;
    const workspaceId = options?.workspaceId || process.env.NOTCMS_WORKSPACE_ID;
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
    this.query = {} as {
      [K in keyof TSchema]: DatabaseHandler<
        InferProperties<TSchema[K]["properties"]>
      >;
    };
    const schema = options?.schema;
    if (!schema) {
      throw new Error("schema is required.");
    }
    for (const key in schema) {
      this.query[key as keyof TSchema] = new DatabaseHandler(
        this.secretKey,
        this.workspaceId,
        schema[key].id
      );
    }
  }
}
