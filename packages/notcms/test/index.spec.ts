import { Client } from "../src/client";
import { schema } from "../src/sample-schema";

describe("notcms", () => {
  it.skip("should successfully list pages", async () => {
    const nc = new Client({ schema: schema });
    const [data] = await nc.query.abc.list();
    console.log(data);
  });

  it.skip("should successfully get a page", async () => {
    const nc = new Client({ schema: schema });
    const [data] = await nc.query.abc.get("123");
    console.log(data);
  });
});
