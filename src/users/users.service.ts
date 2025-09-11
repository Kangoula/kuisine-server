import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/mixins/base-entity-service.mixin';
import { User, UserCredentialsColumn } from './entities/user.entity';
import { bcryptHash } from '@/common/helpers';
import { compare } from 'bcrypt';
import { UserWithoutCredentials } from './dto/user-without-credentials.dto';
import { RolesService } from '@/roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class UsersService
  extends BaseEntityService(User)
  implements OnApplicationBootstrap
{
  constructor(
    private rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async onApplicationBootstrap() {
    await this.createAdminUserIfNotExists();
  }

  private async createAdminUserIfNotExists(): Promise<boolean> {
    const username = this.configService.get<string>('ADMIN_USERNAME') as string;

    try {
      await this.findByUsername(username);

      return true;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        const password = this.configService.get<string>(
          'ADMIN_PASSWORD',
        ) as string;

        const adminRole = await this.rolesService.getAdminRole();

        await this.create({
          username,
          password,
          roleId: adminRole.id,
          mustChangePassword: false,
        });

        return true;
      }

      return false;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutCredentials> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await bcryptHash(createUserDto.password);
    user.role = await this.getRoleForUserCreation(createUserDto.roleId);
    user.mustChangePassword = createUserDto.mustChangePassword ?? true;

    return this.repository.save(user);
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
      select: ['id', 'username', 'mustChangePassword', credentialsColumn],
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
