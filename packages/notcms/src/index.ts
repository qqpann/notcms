import { routes } from './routes';
import { InferProperties, PageProperties, Properties } from './types';

interface Page {
  id: string;
  properties: Record<string, any>;
  content: string;
}

class DatabaseHandler<TProperties extends Properties> {
  constructor(private secretKey: string, private pageProperties: TProperties) {}

  async listPageIds() {
    const res = await fetch(routes.pages, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
    const data = await res.json();
    return data as string[];
  }

  async getPage(pageId: string) {
    const res = await fetch(routes.page(pageId), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
    const data = await res.json();
    return data as InferProperties<TProperties>;
  }
}

interface ClientOptions {
  secretKey?: string;
  pageProperties: PageProperties;
}
export class Client<TSchema extends PageProperties> {
  private secretKey: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<TSchema[K]['properties']>;
  };

  constructor(options?: ClientOptions) {
    this.secretKey = options?.secretKey || 'default_key';
    this.query = {} as {
      [K in keyof TSchema]: DatabaseHandler<TSchema[K]['properties']>;
    };
    for (const [key, value] of Object.entries(options?.pageProperties || {})) {
      const _key = key as keyof TSchema;
      this.query[_key] = new DatabaseHandler(
        this.secretKey,
        (value as TSchema[keyof TSchema])['properties']
      );
    }
  }
}
