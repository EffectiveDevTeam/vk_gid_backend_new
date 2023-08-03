import { Injectable } from '@nestjs/common';

require('core-js/modules/es.promise');
require('core-js/modules/es.string.includes');
require('core-js/modules/es.object.assign');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.symbol');
require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');
import * as Excel from 'exceljs';

@Injectable()
export class ExcelService {
  getExcelBook(): Excel.Workbook {
    const workbook = new Excel.Workbook();
    workbook.creator = 'RomanDev';
    workbook.lastModifiedBy = 'God of CRM';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible',
      },
    ];
    return workbook;
  }

  fillWorkSheet(
    worksheet: Excel.Worksheet,
    columns: Partial<Excel.Column>[],
    rows: any[],
  ): void {
    worksheet.columns = columns;
    worksheet.addRows(rows);
  }

  setBoldNameColumns(worksheet: Excel.Worksheet): void {
    worksheet.getRow(1).font = { bold: true };
  }

  async exportBook(workbook: Excel.Workbook) {
    return workbook.xlsx.writeBuffer();
  }
}
