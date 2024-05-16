import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiCreatedResponse({ type: PostEntity })
  async create(@Body() createPostDto: CreatePostDto) {
    return new PostEntity(await this.postsService.create(createPostDto));
  }

  @Get()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll() {
    const posts = await this.postsService.findAll();
    return posts.map((post) => new PostEntity(post));
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`No Post with id ${id}`);
    }
    return post;
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: PostEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto) {
    return new PostEntity(await this.postsService.update(id, data));
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new PostEntity(await this.postsService.remove(id));
  }
}
