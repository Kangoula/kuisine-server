import { DataSource, EntitySubscriberInterface, ObjectLiteral } from 'typeorm';
import { Constructor } from './types';
import { Type } from '@nestjs/common';

export function BaseEntitySubscriber<T extends ObjectLiteral>(
  entity: Constructor<T>,
): Type<EntitySubscriberInterface<T>> {
  class BaseEntitySubscriberHost implements EntitySubscriberInterface<T> {
    constructor(dataSource: DataSource) {
      dataSource.subscribers.push(this);
    }

    listenTo() {
      return entity;
    }
  }

  return BaseEntitySubscriberHost;
}
