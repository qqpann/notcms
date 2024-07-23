import { host } from './variables';

export const routes = {
  // cli
  schema: (wsId: string): string => host + `/ws/${wsId}/schema`,

  // client
  pages: (wsId: string, dbId: string): string =>
    host + `/ws/${wsId}/db/${dbId}/pages`,
  page: (wsId: string, dbId: string, pageId: string): string =>
    host + `/ws/${wsId}/db/${dbId}/pages/${pageId}`,
};
