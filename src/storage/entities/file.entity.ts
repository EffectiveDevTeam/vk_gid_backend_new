import { allowedFileTypesType } from '@app/core/enums';
import { UserEntity } from 'src/users/entities';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.uploaded_files)
  uploaded_by: UserEntity;

  @Column()
  path: string;

  @Column()
  hash: string;

  @Column()
  created_at: number;

  @Column({
    type: 'enum',
    enum: allowedFileTypesType,
  })
  mimeType: allowedFileTypesType;

  @Column({ default: false })
  saved: boolean;
}
