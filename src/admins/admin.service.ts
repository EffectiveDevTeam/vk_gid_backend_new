import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { AdminEntity, RequestSupporterEntity } from '@prisma/client';
import { ExcelService } from '@app/excel';
import { PeriodsEnum } from '@app/core';
import { convertTrueFalse, getHumanyTime } from '@app/utils';
import { RequestsService } from 'src/requests/requests.service';

@Injectable()
export class AdminsService {
  constructor(
    private prisma: PrismaService,
    private excel: ExcelService,
    private requests: RequestsService,
  ) {}

  async findOne(username: string): Promise<AdminEntity | undefined> {
    return this.prisma.adminEntity.findUnique({ where: { username } });
  }

  async exportRequestsExcel(period: PeriodsEnum) {
    const columns = [
      { header: 'ФИО', key: 'name', width: 16 },
      { header: 'Номер телефона', key: 'phone', width: 16 },
      { header: 'Адрес', key: 'address', width: 16 },
      { header: 'Соц сеть', key: 'social_media', width: 16 },
      { header: 'Агитатор', key: 'help_agit', width: 16 },
      { header: 'Жизнь партии', key: 'help_part_life', width: 16 },
      { header: 'Привлечь друзей', key: 'help_friends', width: 16 },
      { header: 'Проголосовать', key: 'help_vote', width: 16 },
      { header: 'Готов помочь', key: 'help_custom', width: 16 },
      { header: 'Хочу высказаться', key: 'speak_out', width: 20 },
      { header: 'Дата получения', key: 'request_time', width: 19 },
    ];

    const book = this.excel.getExcelBook();
    const worksheet = book.addWorksheet('Выгрузка');
    this.excel.setBoldNameColumns(worksheet);

    const rows = await this.requests.getRequestsByPeriod(period);

    const formatRow = (row: RequestSupporterEntity) => {
      return {
        ...row,
        help_agit: convertTrueFalse(row.help_agit),
        help_part_life: convertTrueFalse(row.help_part_life),
        help_friends: convertTrueFalse(row.help_friends),
        help_vote: convertTrueFalse(row.help_vote),
        request_time: getHumanyTime(row.request_time).datetime,
        help_custom: row.help_custom.length ? row.help_custom : '-',
      };
    };

    const formatedRows = [];
    for (const row of rows) {
      formatedRows.push(formatRow(row));
    }

    this.excel.fillWorkSheet(worksheet, columns, formatedRows);

    return this.excel.exportBook(book);
  }
}
