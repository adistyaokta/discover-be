import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class Post implements Post {
  @ApiProperty()
  caption: string;

  @ApiProperty({ required: false, nullable: true })
  media: string | null;

  @ApiProperty({ required: false, nullable: true })
  authorId: number | null;

  @ApiProperty({ required: false, type: User })
  author?: User;

  constructor({ author, ...data }: Partial<Post>) {
    Object.assign(this, data);

    if (author) {
      this.author = new User(author);
    }
  }
}
