import { promises as fs } from 'fs';
import { loadConfig, dumpConfig } from './features/config';
import { fetchSchema } from './features/schema';

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

  const schema = await fetchSchema();

  await fs.writeFile(schemaPath, schema);
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
