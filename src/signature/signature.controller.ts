import {
  Controller,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import * as Hancock from 'hancock';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller('signature')
export class SignatureController {
  private readonly logger: Logger = new Logger(SignatureController.name);

  @Post('/')
  @UseInterceptors(FileInterceptor('signature'))
  public async store(
    @UploadedFile() signatureImageFile: Express.Multer.File,
  ): Promise<any> {
    const timestamp = Date.now();
    const signatureImageFileNewName = `${timestamp}.${signatureImageFile.filename.split('.').pop()}`;
    const source = path.resolve(process.cwd(), signatureImageFile.path);
    const destination = path.resolve(
      process.cwd(),
      'uploads',
      signatureImageFileNewName,
    );

    await fs.rename(source, destination);

    return {
      timestamp,
    };
  }

  @Post('/:signatureId')
  @UseInterceptors(FileInterceptor('signature'))
  public async validate(
    @Param('signatureId') signatureId: string,
    @UploadedFile() signatureImageFile: Express.Multer.File,
  ): Promise<any> {
    const sourceImageFilePath = path.resolve(
      process.cwd(),
      'uploads',
      `${signatureId}.jpg`,
    );

    const result = await Hancock.single(
      sourceImageFilePath,
      signatureImageFile.path,
    );

    this.logger.debug(result);

    return result;
  }
}
