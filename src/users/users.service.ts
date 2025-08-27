import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import { compare } from 'bcrypt';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService extends BaseEntityService(User) {
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await bcryptHash(createUserDto.password);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.repository.save(user);

    return createdUser;
  }

  public findByUsernameWithPassword(username: string) {
    return this.repository.findOneOrFail({
      where: { username },
      // the password column default behavior makes it not selectable, we have to add an explicit selection to retrieve it
      select: ['id', 'username', 'password'],
    });
  }

  public findByUsernameWithRefreshToken(userId: number) {
    return this.repository.findOneOrFail({
      where: { id: userId },
      // the password column default behavior makes it not selectable, we have to add an explicit selection to retrieve it
      select: ['id', 'username', 'refreshToken'],
    });
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcryptHash(refreshToken);
    await this.update(userId, { refreshToken: hashedRefreshToken });
  }

  async getUserMatchingRefreshToken(userId: number, refreshToken: string) {
    const user = await this.findByUsernameWithRefreshToken(userId);

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
}
