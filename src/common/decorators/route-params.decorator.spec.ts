import { ExecutionContext } from '@nestjs/common';
import { entityIdFactory } from './route-params.decorator';

describe('Custom Route Param Decorators', () => {
  describe('EntityId', () => {
    const makeContext = (id: string | number) => {
      return {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { id },
          }),
        }),
      } as unknown as ExecutionContext;
    };

    it('should return a number when id is a string number', () => {
      const result = entityIdFactory(null, makeContext('42'));
      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('should return a number when id is already a number', () => {
      const result = entityIdFactory(null, makeContext(99));
      expect(result).toBe(99);
    });

    it('should return NaN when id is not numeric', () => {
      const result = entityIdFactory(null, makeContext('abc'));
      expect(result).toBeNaN();
    });
  });
});
