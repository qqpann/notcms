import { promises as fs } from 'fs';
import * as path from 'path';

async function init() {
  const config = {
    schema: 'src/notcms/schema.ts',
  };

  await fs.writeFile('notcms.config.json', JSON.stringify(config, null, 2));
  console.log('notcms.config.json created');
}

async function pull() {
  const configPath = path.resolve('notcms.config.json');
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));

  // FIXME: read actual schema path from config
  // const schemaPath = path.resolve(config.schema);
  const schemaPath = path.resolve('src/notcms/schema.ts');
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
