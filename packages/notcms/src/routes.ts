import { host } from './variables';

export const routes = {
  pages: host + '/pages',
  page: (pageId: string): string => host + `/pages/${pageId}`,
};
