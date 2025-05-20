import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { ScheduledJobLogService } from './scheduler/scheduled-job-log.service';
import { ScheduledJobLog } from './entities/scheduled-job-log.entity';
import { AblyModule } from 'src/ably/ably.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, ScheduledJobLog]), AblyModule],
  controllers: [TasksController],
  providers: [TasksService, SchedulerService, ScheduledJobLogService],
  exports: [TasksService],
})
export class TasksModule {}
