import { promises as fs } from 'fs';
import * as path from 'path';
import { Config, isConfig } from './types';

const DEFAULT_CONFIG: Config = {
  schema: 'src/notcms/schema.ts',
};

export function dumpConfig(
  configPath: string,
  config: Config = DEFAULT_CONFIG
): Promise<void> {
  return fs.writeFile(
    path.resolve(configPath),
    JSON.stringify(config, null, 2)
  );
}

export async function loadConfig(configPath: string): Promise<Config> {
  try {
    const config = JSON.parse(
      await fs.readFile(path.resolve(configPath), 'utf-8')
    );
    if (!isConfig(config)) {
      throw new Error('Invalid config');
    }
    return config;
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}
