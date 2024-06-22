import { routes } from './routes';
import { PageProperties, pageProperties } from './schema';

interface Page {
  id: string;
  properties: Record<string, any>;
  content: string;
}

class DatabaseHandler<
  TProperties extends Record<string, any> = Record<string, any>
> {
  constructor(private secretKey: string, private pageProperties: TProperties) {}

  async listPageIds() {
    return await fetch(routes.pages, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
  }

  async getPage(pageId: string) {
    return await fetch(routes.page(pageId), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
  }
}

interface ClientOptions {
  secretKey?: string;
  pageProperties: PageProperties;
}
export class Client<TSchema extends PageProperties> {
  private secretKey: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<TSchema[K]>;
  };

  constructor(options?: ClientOptions) {
    this.secretKey = options?.secretKey || 'default_key';
    this.query = {} as {
      [K in keyof TSchema]: DatabaseHandler<TSchema[K]>;
    };
    for (const [key, value] of Object.entries(options?.pageProperties || {})) {
      const _key = key as keyof TSchema;
      this.query[_key] = new DatabaseHandler(
        this.secretKey,
        value as TSchema[keyof TSchema]
      );
    }
  }
}

new Client({ pageProperties });
