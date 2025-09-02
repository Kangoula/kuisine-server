import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { RolesModule } from '@/roles/roles.module';

@Module({
  imports: [RolesModule],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
