// scheduled-job-log.entity.ts
import { ScheduleJobLogStatus } from '../../enums/schedule-log-job.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('scheduled_job_logs')
export class ScheduledJobLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_name' })
  jobName: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'affected_count', type: 'int', nullable: true })
  affectedCount: number;

  @Column({ type: 'enum', enum: ScheduleJobLogStatus })
  status: ScheduleJobLogStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string;
}
