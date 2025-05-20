import { ScheduleJobLogStatus } from '../enums/schedule-log-job.enum';
import { enumToArray } from '../helpers/converter.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateScheduleJobLogsTable1747676337763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('scheduled_job_logs');
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'scheduled_job_logs',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
            },
            {
              name: 'job_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'started_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'completed_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'affected_count',
              type: 'int',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'enum',
              enum: enumToArray(ScheduleJobLogStatus),
              enumName: 'schedule_job_log_status',
              isNullable: false,
            },
            {
              name: 'error_message',
              type: 'text',
              isNullable: true,
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('scheduled_job_logs');
    if (hasTable) {
      await queryRunner.dropTable('scheduled_job_logs');
    }

    const hasEnum = await queryRunner.query(
      `SELECT 1 FROM pg_type WHERE typname = 'schedule_job_log_status'`,
    );

    if (hasEnum.length) {
      await queryRunner.query(`DROP TYPE "schedule_job_log_status"`);
    }
  }
}
