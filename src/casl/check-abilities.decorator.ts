import { BaseEntity } from '@/common/entities';
import { Constructor } from '@/common/types';
import { SetMetadata } from '@nestjs/common';

export const REQUIRED_ABILITY = 'requiredAbility';

type Subject = Constructor<BaseEntity> | string;

export interface RequiredAbility {
  action: string;
  subject: Subject;
  conditions?: any;
}

export const Can = (...abilities: RequiredAbility[]) =>
  SetMetadata(REQUIRED_ABILITY, abilities);
