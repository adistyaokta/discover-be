import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 6;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { username: data.username }
    });

    if (foundUser) {
      throw new ConflictException('Username is already taken');
    }

    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);

    data.password = hashedPassword;

    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!foundUser) {
      throw new ConflictException('User not found');
    }

    if (data.username && data.username !== foundUser.username) {
      const validUsername = await this.prisma.user.findUnique({
        where: { username: data.username }
      });

      if (validUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
