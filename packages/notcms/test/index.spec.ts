import { Client } from '../src';
import { pageProperties } from '../src/schema';

describe('index', () => {
  describe('notcms', () => {
    it('should successfully list page ids', async () => {
      const message = 'Hello';

      const nc = new Client({ pageProperties });
      const res = await nc.query.abc.listPageIds();
      const data = await res.json();

      expect(data).toMatch(message);
    });
  });
});
