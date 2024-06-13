import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class Post implements Post {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  caption: string;

  @ApiProperty({ required: false })
  media?: string;

  @ApiProperty({ required: false, type: User })
  author?: User;

  @ApiProperty()
  likedBy?: { id: number }[];

  // @ApiProperty()
  // comments?: User[];

  constructor({
    id,
    createdAt,
    updatedAt,
    caption,
    media,
    author,
    likedBy
    // comments
  }: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    caption: string;
    media?: string;
    author?: Partial<User>;
    likedBy?: { id: number }[];
    // comments?: string[]
  }) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.caption = caption;
    this.media = media;
    this.likedBy = likedBy;
    // this.comments = comments;

    if (author) {
      this.author = new User(author);
    }
  }
}
