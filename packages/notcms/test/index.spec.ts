import { Client } from '../src/client';
import { schema } from '../src/sample-schema';

describe('index', () => {
  describe('notcms', () => {
    it.skip('should successfully list page ids', async () => {
      const nc = new Client({ schema: schema });
      const { data } = await nc.query.abc.listPageIds();
    });

    it.skip('should successfully get a page', async () => {
      const nc = new Client({ schema: schema });
      const { data } = await nc.query.abc.getPage('123');
    });
  });
});
