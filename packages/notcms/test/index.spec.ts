import { Client } from '../src';
import { pageProperties } from '../src/schema';

describe('index', () => {
  describe('notcms', () => {
    it('should successfully list page ids', async () => {
      const message = 'Hello';

      const nc = new Client<typeof pageProperties>({ pageProperties });
      const { data } = await nc.query.abc.listPageIds();

      expect(data).toMatch(message);
    });

    it('should successfully get a page', async () => {
      const message = 'Hello';

      const nc = new Client({ pageProperties });
      const { data } = await nc.query.abc.getPage('123');

      expect(data).toMatch(message);
    });
  });
});
