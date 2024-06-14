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
  UseGuards,
  Query
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentDto, CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentUser } from 'src/users/decorators/get-current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GetCurrentUserId } from 'src/users/decorators/get-current-userId.decorator';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  test(@GetCurrentUserId() user: User) {
    console.log(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostEntity })
  async create(@Body() createPostDto: CreatePostDto) {
    return new PostEntity(await this.postsService.create(createPostDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll() {
    const posts = await this.postsService.findAll();
    return posts.map((post) => new PostEntity(post));
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async getRecentPost() {
    const posts = await this.postsService.getRecentPost();
    return posts.map((post) => new PostEntity(post));
  }

  @Get('trending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async searchPost(@Query('s') s: string) {
    const posts = await this.postsService.searchPosts(s);
    return posts;
  }

  @Get('/author/:authorId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async getPostByAuthor(@Param('authorId', ParseIntPipe) authorId: number): Promise<PostEntity[]> {
    const posts = await this.postsService.getPostByAuthor(authorId);
    return posts.map((post) => new PostEntity(post));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`No Post with id ${id}`);
    }
    return post;
  }

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async likePost(@GetCurrentUserId() userId: number, @Param('postId', ParseIntPipe) postId: number) {
    return await this.postsService.likePost(userId, postId);
  }

  @Delete(':postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unlikePost(@GetCurrentUserId() userId: number, @Param('postId', ParseIntPipe) postId: number) {
    return await this.postsService.unlikePost(userId, postId);
  }

  // @Get('/random/:count')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: PostEntity, isArray: true })
  // async getRandomPost(@Param('count', ParseIntPipe) count: number): Promise<PostEntity[]> {
  //   const randomPosts = (await this.postsService.getRandomPost(count)) as any[];
  //   return randomPosts.map((post) => new PostEntity(post));
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto) {
    return new PostEntity(await this.postsService.update(id, data));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new PostEntity(await this.postsService.remove(id));
  }

  @Get(':postId/comments')
  async getCommentsOfMemorie(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.getPostComments(id);
  }

  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addComment(
    @GetCurrentUserId() user: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() comment: CommentDto
  ) {
    return await this.postsService.addComment(user, postId, comment);
  }
}
