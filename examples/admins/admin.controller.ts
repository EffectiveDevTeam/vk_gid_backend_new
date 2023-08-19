import {
  Controller,
  Request,
  UseGuards,
  Get,
  Post,
  Body,
  Header,
  StreamableFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '@app/auth/guards';
import { AdminsService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExportExcelBookDto } from './dto';

@ApiBearerAuth()
@ApiTags('Админ методы')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminsController {
  constructor(private adminService: AdminsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль' })
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('exportRequestsExcel')
  @Header(
    'content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiOperation({ summary: 'Экспортировать данные в Excel' })
  async exportRequestsExcel(
    @Body() body: ExportExcelBookDto,
  ): Promise<StreamableFile> {
    return new StreamableFile(
      new Uint8Array(await this.adminService.exportRequestsExcel(body.period)),
    );
  }
}
