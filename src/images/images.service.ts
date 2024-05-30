import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}
  async uploadImage(filename: string, path: string) {
    try {
      const createdImage = await this.prisma.image.create({
        data: {
          filename,
          path
        }
      });
      return createdImage;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}
