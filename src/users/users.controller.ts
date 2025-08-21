import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '@/common/pagination';
import { UsersService } from './users.service';
import { EntityId } from '@/common/decorators/route-params.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.paginate(paginationDto);
  }

  @Get(':id')
  findOne(@EntityId() id: number) {
    return this.usersService.findOneOrFail(id);
  }

  @Patch(':id')
  update(@EntityId() id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@EntityId() id: number) {
    await this.usersService.findOneOrFail(id);
    return this.usersService.remove(id);
  }
}
