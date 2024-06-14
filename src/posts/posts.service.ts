import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommentDto, CreatePostDto } from './dto/create-post.dto';
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
        likedBy: {
          select: {
            id: true
          }
        },
        comments: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
                avaUrl: true,
                id: true
              }
            }
          }
        }
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
        comments: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
                avaUrl: true,
                id: true
              }
            }
          }
        }
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
        author: true,
        likedBy: {
          select: {
            id: true
          }
        },
        comments: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
                avaUrl: true,
                id: true
              }
            }
          }
        }
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
        },
        likedBy: {
          select: {
            id: true
          }
        },
        comments: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
                avaUrl: true,
                id: true
              }
            }
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
        },
        likedBy: {
          select: {
            id: true
          }
        },
        comments: {
          select: {
            content: true,
            id: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
                avaUrl: true,
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        _relevance: {
          fields: ['caption'],
          search: s,
          sort: 'asc'
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

  async likePost(userId: number, postId: number) {
    await Promise.all([this.checkIfPostExist(postId), this.checkIfUserExist(userId)]);

    return await this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likedBy: {
          connect: {
            id: userId
          }
        }
      }
    });
  }

  async unlikePost(userId: number, postId: number) {
    await Promise.all([this.checkIfPostExist(postId), this.checkIfUserExist(userId)]);

    return await this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likedBy: {
          disconnect: {
            id: userId
          }
        }
      }
    });
  }

  async checkIfPostExist(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post) throw new NotFoundException('Post not found!');
    return post;
  }

  async checkIfUserExist(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async getPostComments(postId: number) {
    await this.checkIfPostExist(postId);
    return await this.prisma.comment.findMany({
      where: {
        id: postId
      }
    });
  }

  async addComment(userId: number, postId: number, data: CommentDto) {
    await Promise.all([this.checkIfPostExist(postId), this.checkIfUserExist(userId)]);

    return await this.prisma.post.update({
      where: {
        id: postId
      },
      data: {
        comments: {
          create: {
            ...data,
            authorId: userId
          }
        }
      }
    });
  }
}
