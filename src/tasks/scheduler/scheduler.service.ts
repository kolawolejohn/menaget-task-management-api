// tasks/scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from '../tasks.service';
import { ScheduledJobLogService } from './scheduled-job-log.service';
import { ScheduleJobLogStatus } from 'src/enums/schedule-log-job.enum';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly scheduledJobLogService: ScheduledJobLogService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const jobName = 'MarkTasksOlderThan7Days';
    const startedAt = new Date();

    this.logger.log(`Running scheduled task: ${jobName}`);

    try {
      const updatedCount = await this.tasksService.markTasksOlderThan7Days();

      await this.scheduledJobLogService.createLog({
        jobName,
        startedAt,
        completedAt: new Date(),
        affectedCount: updatedCount,
        status: ScheduleJobLogStatus.SUCCESS,
      });

      if (updatedCount > 0) {
        this.logger.log(`✅ Updated ${updatedCount} task(s) to COMPLETED`);
      } else {
        this.logger.log('ℹ️ No tasks older than 7 days to update');
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to run scheduled task: ${error.message}`,
        error.stack,
      );

      await this.scheduledJobLogService.createLog({
        jobName,
        startedAt,
        completedAt: new Date(),
        status: ScheduleJobLogStatus.FAILURE,
        errorMessage: error.message,
      });
    }
  }
}
