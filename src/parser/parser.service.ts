import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { VKService } from '@app/vk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from 'src/tasks/entities';
import { MaterialTypesEnum, TaskStatusEnum } from 'src/tasks/enums';
import { Injectable } from '@nestjs/common';
import { WallPostIdRegex } from './constants';

@Injectable()
export class ParserService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    private vkService: VKService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async parseContent() {
    console.log('Parsing started');
    let need_itirate = true;
    let skip = 0;

    while (need_itirate) {
      const contents = await this.tasksRepository.find({
        where: {
          status: TaskStatusEnum.COMPLETED,
          material_type: MaterialTypesEnum.POST,
        },
        take: 100,
        skip,
      });
      if (contents.length !== 100) need_itirate = false;
      skip += 100;

      const postsIds = contents
        .map((v) => this.getPostIdFromLink(v.moderated_link))
        .filter((v) => v !== null);
      const vkPosts = await this.vkService.getPosts(postsIds);

      const updatedEntities = [];

      for (const content of contents) {
        const vkPost = vkPosts.find(
          (post) =>
            post.from_id + '_' + post.id ===
            this.getPostIdFromLink(content.moderated_link),
        );
        if (!vkPost) continue;
        const newData = {
          ...content,
          views_count: vkPost.views.count,
        };
        updatedEntities.push(newData);
      }

      await this.tasksRepository.save(updatedEntities);
    }
  }

  getPostIdFromLink(link: string) {
    const match = link.match(WallPostIdRegex);
    if (!match) return null;
    return link.match(WallPostIdRegex)[1];
  }
}
