import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString, Matches, MaxLength, MinLength, ValidateIf, isNumberString } from 'class-validator';

export class SetNicknameDto {
  @ApiProperty()
  @IsString()
  @MinLength(1, {message: 'Ник слишком короткий'})
  @MaxLength(11, {message: 'Ник слишком длиный'})
  @Matches(/^[a-zа-яё0-9_ ]*$/ui, { message: 'В нике недопустимые символы'})
  @ValidateIf((_, value) => !isNumberString(value), { message: 'Ник не может быть числом' })
  nickname: string;

}
