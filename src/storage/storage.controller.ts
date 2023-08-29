import { PublicAccessDecorator, Roles, User } from '@app/core/decorators';
import {
  HttpMessagesEnum,
  RoleEnum,
  allowedFileTypesType,
} from '@app/core/enums';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import * as hasha from 'hasha';
import { StorageService } from 'src/storage/storage.service';
import { UserEntity } from 'src/users/entities';
import { Repository } from 'typeorm';
import { FileEntity } from './entities';
import { allowedFileTypes } from '@app/core/enums';
import { ConfigService } from '@nestjs/config';

@ApiBearerAuth()
@ApiTags('Файловое хранилище')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>,
  ) {}

  @Get(':filename')
  @PublicAccessDecorator()
  @ApiOperation({ summary: 'Скачать файл из хранилища' })
  async download(@Param('filename') filename: string) {
    const file = await this.storageService.getBufferObject(filename);

    const mimeTypes = {
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    const ext = filename.split('.').at(-1);

    return new StreamableFile(file, {
      type: mimeTypes[ext] ?? 'application/octet-stream',
    });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!Object.values(allowedFileTypes).includes(file.mimetype as any)) {
          cb(
            new ForbiddenException(
              'Этот тип файлов не поддерживается для загрузки',
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Загрузить файл в хранилище' })
  @Roles(RoleEnum.MODERATOR)
  async upload(
    @User() user: UserEntity,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileEntity> {
    const path_s3 = this.configService.get('S3_STORAGE_PATH');
    const ext = file.originalname.split('.').at(-1);
    const filename = `${await hasha.async(file.originalname, {
      algorithm: 'md5',
    })}.${ext}`;
    const path = `${path_s3}/userFiles/${filename}`;
    return await this.storageService.upload(
      user,
      path,
      file.buffer,
      file.mimetype as allowedFileTypesType,
    );
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Удалить файл из хранилища' })
  @Roles(RoleEnum.ADMIN)
  async delete(
    @User() user: UserEntity,
    @Param('fileId') fileId: string,
  ): Promise<boolean> {
    const fileInfo = await this.filesRepository.findOne({
      relations: { uploaded_by: true },
      where: { id: +fileId },
    });
    if (!fileInfo) throw new NotFoundException('Файл не найден');
    if (fileInfo.uploaded_by.vk_id !== user.vk_id)
      throw new ForbiddenException(HttpMessagesEnum.FORBIDDEN_OBJECT);

    return await this.storageService.delete(fileInfo.id);
  }
}
