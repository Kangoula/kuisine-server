import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/pagination';
import { UsersService } from './users.service';
import { EntityId } from '@/common/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger';
import { UserWithoutCredentials } from './dto/user-without-credentials.dto';
import { Permission } from '@/casl/permission.decorator';
import { Action } from '@/casl/action.enum';
import { User } from './entities/user.entity';
import { CookieTypeNames } from '@/auth/auth.service';

@ApiCookieAuth(CookieTypeNames.Access)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permission(User, Action.Read)
  @ApiOkResponse({ type: UserWithoutCredentials, isArray: true })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.paginate(paginationDto);
  }

  @Get(':id')
  @Permission(User, Action.Read)
  findOne(@EntityId id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Permission(User, Action.Create)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Permission(User, Action.Update)
  update(@EntityId id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permission(User, Action.Delete)
  async remove(@EntityId id: number) {
    await this.usersService.findOne(id);
    return this.usersService.remove(id);
  }
}
