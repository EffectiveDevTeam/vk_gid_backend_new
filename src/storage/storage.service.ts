import {
  BadGatewayException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandOutput,
} from '@aws-sdk/client-s3';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { FileEntity } from './entities';
import { UserEntity } from 'src/users/entities';
import { getTime } from '@app/utils';
import * as hasha from 'hasha';
import { allowedFileTypesType } from '@app/core/enums';

type FullFileInfoType = FileEntity & { bucketPath: string };

@Injectable()
export class StorageService {
  private readonly s3: S3Client;

  readonly bucket = this.configService.get<string>('S3_STORAGE_BUCKET');
  readonly host = 'https://' + this.configService.get('S3_HOST');
  readonly bucketPath = this.host + '/' + this.bucket;

  private readonly logger = new Logger(StorageService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly filesRepository: Repository<FileEntity>,
  ) {
    this.s3 = new S3Client({
      endpoint: this.host,
      credentials: {
        accessKeyId: this.configService.get('S3_ROOT_USER'),
        secretAccessKey: this.configService.get('S3_ROOT_PASSWORD'),
      },
      region: this.configService.get('S3_REGION'),
    });
  }

  async getFolder(path: string): Promise<ListObjectsCommandOutput> {
    const input = {
      Bucket: this.bucket,
      Prefix: path,
    };
    const icons = await this.s3.send(new ListObjectsCommand(input));
    return icons;
  }
  addBucketPathToResponse(object: FileEntity): FullFileInfoType {
    return { ...object, bucketPath: this.bucketPath };
  }

  async upload(
    user: UserEntity,
    path: string,
    buffer: Buffer,
    mimeType: allowedFileTypesType,
  ): Promise<FullFileInfoType> {
    const hash = await hasha.async(buffer, { algorithm: 'md5' });
    const existFile = await this.filesRepository.findOneBy({ hash });
    if (existFile) return this.addBucketPathToResponse(existFile);
    try {
      const inputData = {
        Bucket: this.bucket,
        Key: path,
        Body: buffer,
        ContentType: mimeType,
      };
      const count = await this.filesRepository
        .createQueryBuilder('files')
        .select('COUNT(*)', 'count')
        .where('files.uploaded_by = :user', { user: user.vk_id })
        .getRawOne();
      if (count > +this.configService.get('S3_FILE_LIMIT_PER_USER_MONTH')) {
        const oldNotSavedFile = await this.filesRepository.findOne({
          where: {
            saved: false,
            uploaded_by: {
              vk_id: user.vk_id,
            },
          },
          order: {
            created_at: 'ASC',
          },
        });
        if (!oldNotSavedFile)
          throw new ForbiddenException('Лимит загрузки файлов исчерпан');
        await this.filesRepository.remove(oldNotSavedFile);
      }

      await this.s3.send(new PutObjectCommand(inputData));
      this.logger.log(`saved ${path}`);
      return this.addBucketPathToResponse(
        await this.filesRepository.save({
          uploaded_by: user,
          path,
          created_at: getTime(),
          hash: hash,
          mimeType,
        }),
      );
    } catch (error) {
      const err = `failed to save ${path}`;
      this.logger.error(err);
      this.logger.error(error);
      throw new BadGatewayException(err);
    }
  }

  async save(user: UserEntity, hash: string): Promise<FileEntity> {
    const fileInfo = await this.filesRepository.findOneBy({
      hash,
    });
    if (!fileInfo) throw new NotFoundException('Файл не найден');
    if (!fileInfo.saved) {
      fileInfo.uploaded_by = user;
      fileInfo.saved = true;
      return this.filesRepository.save(fileInfo);
    }
    return fileInfo;
  }

  async has(path: string): Promise<boolean> {
    try {
      await this.s3.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: path }),
      );
      return true;
    } catch {
      return false;
    }
  }

  async get(filename: string): Promise<GetObjectCommandOutput> {
    try {
      const data = await this.s3.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: filename }),
      );

      return data;
    } catch {
      throw new HttpException('не удалось получить файл', HttpStatus.NOT_FOUND);
    }
  }

  async getBufferObject(filename: string): Promise<Buffer> {
    const fileInfo = await this.get(filename);
    return Buffer.from(fileInfo.Body.toString());
  }

  async delete(fileId: number): Promise<boolean> {
    try {
      const fileInfo = await this.filesRepository.findOneBy({ id: fileId });

      await this.s3.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: fileInfo.path }),
      );
      await this.filesRepository.remove(fileInfo);

      this.logger.log(`deleted ${fileId}`);

      return true;
    } catch (error) {
      const err = `failed to delete ${fileId}`;
      this.logger.error(err);
      this.logger.error(error);
      throw new BadGatewayException(err);
    }
  }

  async getFilesByHash(hashes: string[]): Promise<FileEntity[]> {
    return await this.filesRepository.findBy({ hash: In(hashes) });
  }
}
