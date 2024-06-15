import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';

export class User implements User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  name?: string;

  @ApiProperty()
  @Expose()
  email?: string;

  @Exclude()
  password?: string;

  @ApiProperty()
  @Expose()
  bio?: string;

  @ApiProperty({ name: 'avaUrl' })
  @Expose()
  avaUrl?: string;

  @ApiProperty()
  @Expose()
  createdAt?: Date;

  @ApiProperty()
  @Expose()
  updatedAt?: Date;

  @Expose()
  posts?: Post[];

  @Expose()
  likes?: Post[];

  @Expose()
  comments?: Comment[];

  @Expose()
  following?: Partial<User[]>;

  @Expose()
  followers?: Partial<User[]>;
}
