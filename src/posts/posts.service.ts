import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePostDto) {
    return this.prisma.post.create({ data });
  }

  findAll() {
    return this.prisma.post.findMany();
  }

  getRecentPost() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      include: {
        author: true
      }
    });
  }

  getPostByAuthor(authorId: number) {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      where: { authorId },
      include: {
        author: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
            avaUrl: true,
            name: true,
            id: true
          }
        }
      }
    });
  }

  // getRandomPost(count: number) {
  //   return this.prisma.$queryRaw`
  //     SELECT
  //       posts.*,
  //       json_build_object(
  //         'name', users.name,
  //         'username', users.username,
  //         'avaUrl', users.avaUrl
  //       ) AS author
  //     FROM posts
  //     INNER JOIN users ON posts."authorId" = users.id
  //     ORDER BY RANDOM()
  //     LIMIT ${count}`;
  // }

  async searchPosts(query: string) {
    return this.prisma.post.findMany({
      where: {
        OR: [{ author: { contains: query } }, { caption: { contains: query } }]
      } as any
    });
  }

  update(id: number, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
