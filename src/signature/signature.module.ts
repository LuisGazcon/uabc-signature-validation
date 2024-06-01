import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { SignatureController } from './signature.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
      preservePath: true,
      storage: diskStorage({
        destination: './uploads',
        filename: (_request, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [SignatureController],
})
export class SignatureModule {}
