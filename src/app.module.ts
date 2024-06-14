import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ImagesService } from './images/images.service';
import { ImagesModule } from './images/images.module';
import { ModelsModule } from './models/models.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    PrismaModule,
    UsersModule,
    PostsModule,
    AuthModule,
    ImagesModule,
    ModelsModule
  ],
  controllers: [AppController],
  providers: [AppService, ImagesService]
})
export class AppModule {}
