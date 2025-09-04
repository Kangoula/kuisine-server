import { TypedConstructor } from '@/common/types';
import { DataFactory } from 'nestjs-seeder';

export function generateMany<T extends object>(
  entityClass: TypedConstructor<T>,
  count = 1,
  data?: Partial<T>,
): T[] {
  const generated = DataFactory.createForClass(entityClass).generate(
    count,
    data,
  ) as T[];

  // ensure we return an actual instance of the given class
  return generated.map((d) => {
    const e = new entityClass();
    return Object.assign(e, d);
  });
}

export function generateOne<T extends object>(
  entityClass: TypedConstructor<T>,
  data?: Partial<T>,
): T {
  const entities = generateMany(entityClass, 1, data);

  return entities[0];
}
