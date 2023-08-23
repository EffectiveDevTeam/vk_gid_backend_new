import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Roles, RoleEnum, User } from '@app/core';
import { CreateTaskDto } from './dto';
import { UserEntity } from 'src/users/entities';

@ApiBearerAuth()
@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('role/:id')
  @ApiOperation({ summary: 'Создать задачу' })
  @Roles(RoleEnum.MODERATOR)
  async createTask(@User() user: UserEntity, @Body() body: CreateTaskDto) {
    const { taskType, text, filesIds } = body;
    return this.tasksService.createTask(user, taskType, text, filesIds);
  }
}
