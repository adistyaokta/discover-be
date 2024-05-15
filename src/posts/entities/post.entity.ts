import { ApiProperty } from '@nestjs/swagger';

export class Post implements Post {

  @ApiProperty()
  caption: string;

  @ApiProperty({ required: false, nullable: true })
  media: string | null;

  @ApiProperty({ required: false, nullable: true })
  authorId: number | null;
}
