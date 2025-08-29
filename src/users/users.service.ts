import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/mixins/base-entity.service.mixin';
import { User, UserCredentialsColumn } from './entities/user.entity';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import { compare } from 'bcrypt';
import { UserWithoutCredentials } from './dto/user-without-credentials.dto';
import { RolesService } from '@/roles/roles.service';

@Injectable()
export class UsersService extends BaseEntityService(User) {
  constructor(private rolesService: RolesService) {
    super();
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutCredentials> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await bcryptHash(createUserDto.password);
    user.role = await this.getRoleForUserCreation(createUserDto.roleId);

    return this.insert(user);
  }

  private getRoleForUserCreation(roleId?: number) {
    if (!roleId) {
      return this.rolesService.findByName('User');
    }

    return this.rolesService.findOne(roleId);
  }

  private findByWithCredentials(
    findByCondition: object,
    credentialsColumn: UserCredentialsColumn,
  ) {
    return this.repository.findOneOrFail({
      where: findByCondition,
      // the password column default behavior makes it not selectable, we have to add an explicit selection to retrieve it
      select: ['id', 'username', credentialsColumn],
    });
  }

  public findByUsernameWithPassword(username: string) {
    return this.findByWithCredentials({ username }, 'password');
  }

  public findByIdWithRefreshToken(userId: number) {
    return this.findByWithCredentials({ id: userId }, 'refreshToken');
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcryptHash(refreshToken);
    await this.update(userId, { refreshToken: hashedRefreshToken });
  }

  async getUserMatchingRefreshToken(userId: number, refreshToken: string) {
    const user = await this.findByIdWithRefreshToken(userId);

    if (!user?.refreshToken) {
      return;
    }

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.update(userId, { refreshToken: null });
  }
}
