import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Roles, RoleEnum, User } from '@app/core';
import { CreateTaskDto, ModerateTaskDto, SendTaskToModerateDto } from './dto';
import { UserEntity } from 'src/users/entities';

@ApiBearerAuth()
@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('getTask/:id')
  @ApiOperation({ summary: 'Получить инфо о задаче' })
  @Roles(RoleEnum.USER)
  async getTask(@Param('id') id: string) {
    return this.tasksService.getTask(+id);
  }

  @Get('getTasks/:is_my')
  @ApiOperation({ summary: 'Получить инфо о задачах' })
  @Roles(RoleEnum.USER)
  async getTasks(@User() user: UserEntity, @Param('is_my') is_my: string) {
    return this.tasksService.getTasks(user, Boolean(+is_my));
  }

  @Get('getModerationTasks')
  @ApiOperation({ summary: 'Получить задачи на модерации' })
  @Roles(RoleEnum.MODERATOR)
  async getModerationTasks() {
    return this.tasksService.getModerationTasks();
  }

  @Post('createTask')
  @ApiOperation({ summary: 'Создать задачу' })
  @Roles(RoleEnum.MODERATOR)
  async createTask(@User() user: UserEntity, @Body() body: CreateTaskDto) {
    const { taskType, text, filesHash } = body;
    return this.tasksService.createTask(user, taskType, text, filesHash);
  }
  @Get('takeTask/:id')
  @ApiOperation({ summary: 'Взять задачу в работу' })
  @Roles(RoleEnum.USER)
  async takeTask(@User() user: UserEntity, @Param('id') id: string) {
    return this.tasksService.takeTask(user, +id);
  }
  @Post('sendTaskToModerate')
  @ApiOperation({ summary: 'Отправить выполненную задачу на модерацию' })
  @Roles(RoleEnum.USER)
  async sendTaskToModerate(
    @User() user: UserEntity,
    @Body() body: SendTaskToModerateDto,
  ) {
    const { taskId, link } = body;
    return this.tasksService.sendTaskToModerate(user, taskId, link);
  }
  @Post('moderateTask')
  @ApiOperation({ summary: 'Подтвердить или отклонить выполненную задачу' })
  @Roles(RoleEnum.MODERATOR)
  async moderateTask(@Body() body: ModerateTaskDto) {
    const { taskId, action } = body;
    return this.tasksService.moderateTask(taskId, action);
  }
}
