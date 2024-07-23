import { routes } from '../../routes';

export async function fetchSchema(): Promise<string> {
  const NOTCMS_SECRET_KEY = process.env.NOTCMS_SECRET_KEY;
  if (!NOTCMS_SECRET_KEY) {
    throw new Error('NOTCMS_SECRET_KEY is not set');
  }
  const res = await fetch(routes.schema, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NOTCMS_SECRET_KEY}`,
    },
  });
  const data = (await res.json()) as { schema: string };
  if (typeof data.schema !== 'string') {
    throw new Error(
      `Invalid schema. Expected string, found ${typeof data.schema}.`
    );
  }

  return data.schema;
}
