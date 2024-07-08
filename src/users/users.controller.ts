import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentUserId } from './decorators/get-current-userId.decorator';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new User(user));
  }

  @Post('following/:followedUserId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async follow(@GetCurrentUserId() user: number, @Param('followedUserId', ParseIntPipe) followedUserId: number) {
    return await this.usersService.follow(user, followedUserId);
  }

  @Delete('following/:followedUserId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unfollow(@GetCurrentUserId() user: number, @Param('followedUserId', ParseIntPipe) followedUserId: number) {
    return await this.usersService.unfollow(user, followedUserId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`No user with id ${id}`);
    }
    return new User(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return new User(await this.usersService.update(id, updateUserDto));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: User })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new User(await this.usersService.remove(id));
  }

  // @Post('/test')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async test(@GetCurrentUserId('userId') user: number, @Param('userId') followedUserId: number) {
  //   return await this.usersService.unfollow(user, followedUserId);
  // }
}
