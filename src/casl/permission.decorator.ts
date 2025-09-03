import { Constructor } from '@/common/types';
import { SetMetadata } from '@nestjs/common';
import { Action } from './action.enum';

export const REQUIRED_ABILITY = 'requiredAbility';

type Subject = Constructor | 'all';

export interface RequiredAbility {
  action: `${Action}`;
  subject: Subject;
  field?: string;
}

export const Permission = (subject: Subject, action: Action) =>
  SetMetadata(REQUIRED_ABILITY, { subject, action });
