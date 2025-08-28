import { BaseEntity } from '@/common/entities';
import { Constructor } from '@/common/types';
import { SetMetadata } from '@nestjs/common';

export const CHECK_ABILITY = 'checkAbility';

type Subject = Constructor<BaseEntity> | string;

export interface RequiredRule {
  action: string;
  subject: Subject;
  conditions?: any;
}

export const Can = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
