import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    return this.prisma.post.findMany({
      include: {
        author: true,
        likedBy: true,
        comments: true
      }
    });
  }

  getRecentPost() {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      include: {
        author: true,
        likedBy: {
          select: {
            id: true
          }
        },
        comments: true
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

  async searchPosts(s: string) {
    return this.prisma.post.findMany({
      where: {
        OR: [
          {
            caption: {
              search: s
            }
          },
          {
            author: {
              name: {
                search: s
              }
            }
          },
          {
            author: {
              username: {
                search: s
              }
            }
          }
        ]
      },
      include: {
        author: {
          select: {
            username: true,
            avaUrl: true,
            name: true,
            id: true
          }
        }
      },
      orderBy: {
        _relevance: {
          fields: ['caption'],
          search: s,
          sort: 'desc'
        }
      }
    });
  }

  update(id: number, data: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }

  async likeUnlike(postId: number) {
    try {
      const post = await this.prisma.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new Error('Moment not found');
      }

      const authorId = post.authorId;

      const user = await this.prisma.user.findUnique({ where: { id: authorId }, include: { likes: true } });
      if (!user) {
        throw new Error('User not found!');
      }

      if (user.likes.some((post) => post.id === postId)) {
        await this.prisma.user.update({
          where: { id: authorId },
          data: {
            likes: {
              disconnect: { id: post.id }
            }
          }
        });
        return {
          statusCode: 200,
          message: 'You unliked a post.'
        };
      }

      await this.prisma.user.update({
        where: { id: authorId },
        data: {
          likes: {
            connect: { id: post.id }
          }
        }
      });

      return {
        status: 200,
        message: 'You liked a post.'
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
