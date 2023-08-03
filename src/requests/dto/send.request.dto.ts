import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsBoolean,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class SendRequestDto {
  @ApiProperty({ description: 'Мне есть 18' })
  @IsBoolean()
  legal_age: boolean;

  @ApiProperty({ description: 'ФИО пользователя' })
  @IsString()
  @Length(5)
  name: string;

  @ApiProperty({ description: 'Номер телефона' })
  @IsString()
  @IsPhoneNumber('RU', { message: 'phone Введите российский номер' })
  @Matches('^\\+7', 'gi', { message: 'phone Номер должен начинаться с +7' })
  phone: string;

  @ApiProperty({ description: 'Адрес отправляющго заявку' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Ссылка в соц сети' })
  @IsString()
  @Length(5)
  @Matches(
    'https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
    'gi',
    { message: 'social_media Введите ссылку вида https://example.com/example' },
  )
  social_media: string;

  @ApiProperty({ description: 'Агитатор' })
  @IsBoolean()
  help_agit: boolean;

  @ApiProperty({ description: 'Участвовать в жизни партии' })
  @IsBoolean()
  help_part_life: boolean;

  @ApiProperty({ description: 'Привлечь друзей' })
  @IsBoolean()
  help_friends: boolean;

  @ApiProperty({ description: 'Проголосовать' })
  @IsBoolean()
  help_vote: boolean;

  @ApiProperty({ description: 'Свой вариант Готов помочь' })
  @IsString()
  @Length(0, 100)
  help_custom: string;

  @ApiProperty({ description: 'Поле Хочу высказаться' })
  @IsString()
  @Length(0, 2000)
  speak_out: string;
}
