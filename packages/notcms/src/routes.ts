import { host } from "./variables";

export const routes = {
  pages: (wsId: string, dbId: string): string =>
    host + `/ws/${wsId}/db/${dbId}/pages`,
  page: (wsId: string, dbId: string, pageId: string): string =>
    host + `/ws/${wsId}/db/${dbId}/pages/${pageId}`,
  pageQuality: (wsId: string, dbId: string, pageId: string): string =>
    host +
    `/ws/${encodeURIComponent(wsId)}/db/${encodeURIComponent(dbId)}/pages/${encodeURIComponent(pageId)}/quality`,
};
