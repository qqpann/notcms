import { getApiHost } from "./variables.js";

export const routes = {
  schema: (wsId: string): string => getApiHost() + `/ws/${wsId}/schema`,
};
