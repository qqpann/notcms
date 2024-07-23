import { host } from './variables';

export const routes = {
  // cli
  schema: host + '/schema',

  // client
  pages: host + '/pages',
  page: (pageId: string): string => host + `/pages/${pageId}`,
};
