import { promises as fs } from 'fs';
import { loadConfig, dumpConfig } from './config';
import { routes } from '../routes';

/**
 * Initialize NotCMS
 * - Create notcms.config.json
 */
async function init() {
  await dumpConfig('notcms.config.json');
  console.log('notcms.config.json created');
}

/**
 * Pull schema from NotCMS
 */
async function pull() {
  const config = await loadConfig('notcms.config.json');
  const schemaPath = config.schema;

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
  // TODO: validate response type
  const data = (await res.json()) as { schema: string };

  await fs.writeFile(schemaPath, data.schema);
  console.log(`${schemaPath} updated`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      await init();
      break;
    case 'pull':
      await pull();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      break;
  }
}

main().catch(err => {
  console.error(err);
  throw err;
});
