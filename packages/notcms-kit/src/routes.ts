import { host } from "./variables";

export const routes = {
  schema: (wsId: string): string => host + `/ws/${wsId}/schema`,
};
