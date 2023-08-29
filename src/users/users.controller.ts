import { Body, Controller, Get, Param, Put, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, User } from '@app/core';
import { RoleEnum } from '@app/core/enums';
import { UsersService } from 'src/users/users.service';
import { ChangeUserRoleDto } from 'src/users/dto';
import { UserEntity } from './entities';

@ApiBearerAuth()
@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('role/:id')
  @ApiOperation({ summary: 'Сменить роль пользователя' })
  @Roles(RoleEnum.ADMIN)
  async changeRole(
    @Param('id') id: string,
    @Body() { role }: ChangeUserRoleDto,
  ) {
    return this.usersService.changeRole(+id, role);
  }

  @Get('getSelf')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Получить информацию о себе' })
  async getSelf(@User() user: UserEntity) {
    return this.usersService.getSelf(user);
  }

  @Get('getTeam')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Получить информацию о редакторах сообщества' })
  async getStaff() {
    return this.usersService.getTeam();
  }

  @Post('addNewMember')
  @Roles(RoleEnum.USER)
  @ApiOperation({ summary: 'Получить информацию о редакторах сообщества' })
  async addNewMember() {
    return this.usersService.addNewMember();
  }
}
