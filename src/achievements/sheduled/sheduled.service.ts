import {
    Injectable,
} from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { AchievementsHandlers } from './achievements';

@Injectable()
export class SheduledAchievementsService {
    constructor(
        private dataSource: DataSource,
    ) { }


    @Cron(CronExpression.EVERY_12_HOURS)
    async giveAchievements() {
        for(let achievement of AchievementsHandlers) {
            let handler = new achievement(this.dataSource);
            await handler.giveAuto();
        }
    }

}