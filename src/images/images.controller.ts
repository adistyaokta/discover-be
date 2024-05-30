import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { ImagesService } from './images.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const savedFileName = `${name.split(' ').join('_')}_${Date.now()}.${fileExtension}`;

          cb(null, savedFileName);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      }
    })
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    }
    const filename = file.filename;
    const path = `./uploads/${filename}`;

    const uploadedImage = await this.imageService.uploadImage(filename, path);

    const response = {
      message: 'Image uploaded successfully',
      filePath: `http://localhost:3000/images/${filename}`,
      data: uploadedImage
    };
    return response;
  }

  @Get('/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }
}
