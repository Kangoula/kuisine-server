import { SetMetadata } from '@nestjs/common';

export const IS_PULBIC_KEY = 'isPulic';
export const Public = () => SetMetadata(IS_PULBIC_KEY, true);
