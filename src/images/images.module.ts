import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
  imports: [PrismaModule]
})
export class ImagesModule {}
