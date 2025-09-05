import { BaseEntityService } from '@/common/mixins/base-entity-service.mixin';
import { Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService extends BaseEntityService(Role) {
  findByName(name: string) {
    return this.repository.findOneByOrFail({
      name,
    });
  }

  getAdminRole() {
    return this.repository.findOneByOrFail({
      isAdmin: true,
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return super.update(id, updateRoleDto);
  }
}
