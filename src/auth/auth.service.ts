import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import { TokenPayload } from './tokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from '@/database/postgresErrorCodes.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsernameWithPassword(username);

      if (user) {
        await this.verifyPassword(user.password, password);

        return user;
      }
    } catch {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(userPassword: string, givenPassword: string) {
    const isPasswordValid = await bcryptCompare(givenPassword, userPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public async register(registerData: RegisterDto) {
    const hashedPassword = await bcryptHash(registerData.password);

    try {
      const createdUser = (await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      })) as Partial<User>;
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'A User with this username already exists',
        );
      }

      throw new InternalServerErrorException();
    }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };

    console.log(
      '.??????????????????????????????????',
      this.configService.get('JWT_EXPIRATION_TIME') || 'caca',
    );

    const token = this.jwtService.sign(payload);

    console.log('exp', this.configService.get('JWT_EXPIRATION_TIME'));

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  // public login(user: User) {
  //   return {
  //     access_token: this.jwtService.sign({
  //       username: user.username,
  //       sub: user.id,
  //     }),
  //   };
  // }
}
