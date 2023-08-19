import { HttpMessagesEnum, PeriodsEnum, TimesEnum } from '@app/core';
import { PrismaService } from '@app/prisma';
import { getTime } from '@app/utils';
import { ConflictException, Injectable } from '@nestjs/common';
import { RequestSupporterEntity } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(
    data: Omit<RequestSupporterEntity, 'id'>,
  ): Promise<RequestSupporterEntity> {
    const exsisting_request =
      await this.prisma.requestSupporterEntity.findUnique({
        where: { phone: data.phone },
      });
    if (exsisting_request)
      throw new ConflictException(HttpMessagesEnum.REQUEST_EXSIST);

    return this.prisma.requestSupporterEntity.create({ data });
  }

  async getRequestsByPeriod(
    period: PeriodsEnum,
  ): Promise<RequestSupporterEntity[]> {
    const currentTime = getTime();

    const exportTime =
      period === PeriodsEnum.ALL ? 0 : currentTime - TimesEnum[period];

    return this.prisma.requestSupporterEntity.findMany({
      where: { request_time: { gte: exportTime } },
      orderBy: { request_time: 'desc' },
    });
  }

  // formatRequestForList(row: RequestSupporterEntity): any[] {
  //   return [
  //     row.name,
  //     row.phone,
  //     row.address,
  //     row.social_media,
  //     row.help_custom,
  //     row.speak_out,
  //   ];
  // }
}
