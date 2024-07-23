import { promises as fs } from 'fs';
import { loadConfig, dumpConfig } from './config';

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

  const schemaContent = `
// src/notcms/schema.ts
// for each db, the kit pulls their schema.
// below are examples of schema for dbs: Blog db, and Story db
export type BlogPageProps = {
  slug?: string;
  publishedAt?: Date;
}

export type StoryPageProps = {
  slug?: string;
  category?: string;
}
`;
  await fs.writeFile(schemaPath, schemaContent);
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
