// test/global-teardown.ts
import { dropDatabase } from 'typeorm-extension';
import { options } from './data-source.testing';

export default async () => {
  await dropDatabase({ options: options });
};
