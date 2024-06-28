import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { ImagesService } from './images.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'node:fs';

@Controller('images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post('upload/:folder')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = req.params.folder;
          const uploadPath = `./uploads/${folder}`;

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const savedFileName = `${name.split(' ').join('_')}_${Date.now()}.${fileExtension}`;

          cb(null, savedFileName);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(null, false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    })
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Param('folder') folder: string) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    }

    const filename = file.filename;
    const path = `./uploads/${folder}/${filename}`;

    const uploadedImage = await this.imageService.uploadImage(filename, path);
    const baseUrl = `${process.env.HOST}:${process.env.PORT}`;

    const response = {
      message: 'Image uploaded successfully',
      filePath: `http://${baseUrl}/images/${folder}/${filename}`,
      data: uploadedImage
    };
    return response;
  }

  @Get('/:folder/:filename')
  async getPicture(@Param('folder') folder: string, @Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: `./uploads/${folder}` });
  }
}
