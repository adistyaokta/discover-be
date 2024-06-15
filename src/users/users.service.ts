import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        followers: {
          select: {
            id: true,
            avaUrl: true,
            username: true,
            name: true
          }
        },
        following: {
          select: {
            id: true,
            avaUrl: true,
            username: true,
            name: true
          }
        }
      }
    });
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

  async checkIfUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User does not exist');

    return user;
  }

  async follow(userId: number, followedUserId: number) {
    const [user, followedUser] = await Promise.all([
      await this.checkIfUserExists(userId),
      await this.checkIfUserExists(followedUserId)
    ]);

    if (user === followedUser) {
      throw new ForbiddenException("You cant' follow yourself");
    }

    return await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        following: {
          connect: {
            id: followedUser.id
          }
        }
      },
      select: {
        id: true
      }
    });
  }

  async unfollow(userId: number, followedUserId: number) {
    const [user, followedUser] = await Promise.all([
      await this.checkIfUserExists(userId),
      await this.checkIfUserExists(followedUserId)
    ]);

    if (userId === followedUserId) {
      throw new ForbiddenException("You cant' unfollow yourself");
    }

    return await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        following: {
          disconnect: {
            id: followedUser.id
          }
        }
      },
      select: {
        id: true
      }
    });
  }
}
