import { TypedConstructor } from '@/common/types';
import { DataFactory } from 'nestjs-seeder';
import { DeepPartial } from 'typeorm';

export function generateMany<T>(
  entity: TypedConstructor<T>,
  count = 1,
  data: Partial<T>,
): DeepPartial<T>[] {
  return DataFactory.createForClass(entity).generate(
    count,
    data,
  ) as DeepPartial<T>[];
}

export function generateOne<T>(
  entity: TypedConstructor<T>,
  data: Partial<TypedConstructor<T>>,
): T {
  const entities = generateMany(entity, 1, data);

  return entities[0] as T;
}
