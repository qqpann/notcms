import { host } from "./variables.js";

export const routes = {
  schema: (wsId: string): string => host + `/ws/${wsId}/schema`,
};
