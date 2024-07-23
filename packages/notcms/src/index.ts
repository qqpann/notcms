import { routes } from './routes';
import { InferProperties, Page, PageProperties } from './types';

class DatabaseHandler<TData> {
  constructor(
    private secretKey: string,
    private workspaceId: string,
    private databaseId: string
  ) {}

  async listPageIds() {
    const response = await fetch(
      routes.pages(this.workspaceId, this.databaseId),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );
    const data = (await response.json()) as string[];
    return { data, response };
  }

  async getPage(pageId: string) {
    const response = await fetch(
      routes.page(this.workspaceId, this.databaseId, pageId),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );
    const data = (await response.json()) as Page<TData>;
    return { data, response };
  }
}

export class Client<TSchema extends PageProperties> {
  private secretKey: string;
  private workspaceId: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<
      InferProperties<TSchema[K]['properties']>
    >;
  };

  constructor(options?: {
    secretKey?: string;
    workspaceId?: string;
    pageProperties: TSchema;
  }) {
    const secretKey = options?.secretKey || process.env.NOTCMS_SECRET_KEY;
    const workspaceId = options?.workspaceId || process.env.NOTCMS_WORKSPACE_ID;
    if (!secretKey) {
      throw new Error(
        'secretKey is required. Pass it as an option or set it as an environment variable.'
      );
    }
    if (!workspaceId) {
      throw new Error(
        'workspaceId is required. Pass it as an option or set it as an environment variable.'
      );
    }
    this.secretKey = secretKey;
    this.workspaceId = workspaceId;
    this.query = {} as {
      [K in keyof TSchema]: DatabaseHandler<
        InferProperties<TSchema[K]['properties']>
      >;
    };
    const pageProperties = options?.pageProperties;
    if (!pageProperties) {
      throw new Error('pageProperties is required.');
    }
    for (const key in pageProperties) {
      this.query[key as keyof TSchema] = new DatabaseHandler(
        this.secretKey,
        this.workspaceId,
        pageProperties[key].id
      );
    }
  }
}
