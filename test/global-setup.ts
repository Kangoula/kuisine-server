// test/global-setup.ts
import { createDatabase } from 'typeorm-extension';
import { options } from './data-source.testing';

export default async () => {
  await createDatabase({ options: options });
};
