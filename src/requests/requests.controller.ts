import {
  Controller,
  Post,
  Body,
  ForbiddenException,
  ConflictException,
  Request,
  Ip,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '@app/prisma';
import { SendRequestDto } from './dto';
import { HttpMessagesEnum } from '@app/core/enums';
import { RequestSupporterEntity } from '@prisma/client';
import { getTime } from '@app/utils';
import { Request as RequestType } from 'express';

@ApiTags('Методы для сбора заявок')
@Controller('requests')
export class RequestsController {
  constructor(
    private requestsService: RequestsService,
    private prisma: PrismaService,
  ) {}

  @Post('sendRequest')
  @ApiOperation({ summary: 'Послать заявку на регистрацию сторонника' })
  exportExcelBook(
    @Ip() ip: string,
    @Request() req: RequestType,
    @Body() body: SendRequestDto,
  ): Promise<RequestSupporterEntity> {
    const { legal_age, ...data } = body;
    if (!legal_age) {
      throw new ForbiddenException(HttpMessagesEnum.USER_NOT_REACH_LEGAL_AGE);
    }
    if (
      !(
        data.help_agit ||
        data.help_part_life ||
        data.help_friends ||
        data.help_vote
      ) &&
      !data.help_custom.length
    ) {
      throw new ConflictException(HttpMessagesEnum.USER_NOT_SELECT_POINTS);
    }
    const useragent = req.headers['user-agent'];
    const dataWithStatisticFields = {
      ...data,
      request_time: getTime(),
      useragent,
      ip,
    };

    return this.requestsService.sendRequest(dataWithStatisticFields);
  }
}
