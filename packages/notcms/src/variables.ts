import { getEnv } from "./utils/env";

export const host = getEnv("NOTCMS_API_HOST") ?? "https://api.notcms.com/v1";
