import { BaseEntityService } from '@/common/mixins/base-entity.service.mixin';
import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService extends BaseEntityService(Role) {}
