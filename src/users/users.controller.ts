import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return new User(await this.usersService.create(createUserDto));
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new User(user));
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`No user with id ${id}`);
    }
    return new User(user);
  }

  @Patch(':id')
  @ApiOkResponse({ type: User })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new User(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @ApiOkResponse({ type: User })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new User(await this.usersService.remove(id));
  }
}
