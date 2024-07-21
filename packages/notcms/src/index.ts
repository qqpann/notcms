import { routes } from './routes';
import { InferProperties, PageProperties, Properties } from './types';

interface Page {
  id: string;
  properties: Record<string, string | number | boolean | Date>;
  content: string;
}

class DatabaseHandler<TData> {
  constructor(private secretKey: string) {}

  async listPageIds() {
    const response = await fetch(routes.pages, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
    const data = (await response.json()) as string[];
    return { data, response };
  }

  async getPage(pageId: string) {
    const response = await fetch(routes.page(pageId), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });
    const data = (await response.json()) as {
      id: string;
      properties: TData;
      content: string;
    };
    return { data, response };
  }
}

export class Client<TSchema extends PageProperties> {
  private secretKey: string;

  query: {
    [K in keyof TSchema]: DatabaseHandler<
      InferProperties<TSchema[K]['properties']>
    >;
  };

  constructor(options?: { secretKey?: string; pageProperties: TSchema }) {
    this.secretKey = options?.secretKey || 'default_key';
    this.query = {} as {
      [K in keyof TSchema]: DatabaseHandler<
        InferProperties<TSchema[K]['properties']>
      >;
    };
    for (const key in options?.pageProperties) {
      this.query[key as keyof TSchema] = new DatabaseHandler(this.secretKey);
    }
  }
}
