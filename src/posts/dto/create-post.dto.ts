import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  caption: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  media?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  authorId: number;
}
