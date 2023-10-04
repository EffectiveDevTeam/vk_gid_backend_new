import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard, RolesGuard } from '@app/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities';
import { TasksModule } from './tasks/tasks.module';
import { StorageModule } from './storage/storage.module';
import { MarketModule } from './market/market.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +(process.env.PG_PORT ?? ''),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
      // logging: true,
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forFeature([UserEntity]),
    StorageModule,
    UsersModule,
    TasksModule,
    MarketModule,
    ParserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
