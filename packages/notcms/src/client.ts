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

  async listPageIds() {
    try {
      const response = await fetch(
        routes.pages(this.workspaceId, this.databaseId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch page ids. [${response.status} ${response.statusText}]: ${errorText}`
        );
      }

      const { pageIds } = (await response.json()) as { pageIds: string[] };

      if (!Array.isArray(pageIds)) {
        throw new Error(
          "Invalid response format. Make sure the package is up to date."
        );
      }

      return { data: pageIds, error: null, response: response };
    } catch (error) {
      console.error("Failed to fetch page ids:", error);
      return {
        data: undefined,
        error: error instanceof Error ? error : "Unknown error",
      };
    }
  }

  async listPages() {
    try {
      const response = await fetch(
        routes.pages(this.workspaceId, this.databaseId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch pages. [${response.status} ${response.statusText}]: ${errorText}`
        );
      }

      const { data } = (await response.json()) as {
        data: Pages<TData>;
      };

      return { data: data, error: null, response: response };
    } catch (error) {
      console.error("Failed to fetch pages:", error);
      return {
        data: undefined,
        error: error instanceof Error ? error : "Unknown error",
      };
    }
  }

  async getPage(pageId: string) {
    try {
      const response = await fetch(
        routes.page(this.workspaceId, this.databaseId, pageId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch page. [${response.status} ${response.statusText}]: ${errorText}`
        );
      }

      const { data } = (await response.json()) as { data: Page<TData> };

      return { data: data, error: null, response: response };
    } catch (error) {
      console.error("Failed to fetch page:", error);
      return {
        data: undefined,
        error: error instanceof Error ? error : "Unknown error",
      };
    }
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
