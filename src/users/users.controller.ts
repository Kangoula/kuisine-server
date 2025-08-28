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
import { EntityId } from '@/common/decorators/route-params.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserWithoutCredentials } from './dto/user-without-credentials.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: UserWithoutCredentials, isArray: true })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.paginate(paginationDto);
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(@EntityId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.usersService.findOne(id);
    return this.usersService.remove(id);
  }
}
