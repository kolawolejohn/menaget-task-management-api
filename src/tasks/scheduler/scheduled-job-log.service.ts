import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledJobLog } from '../entities/scheduled-job-log.entity';

@Injectable()
export class ScheduledJobLogService {
  constructor(
    @InjectRepository(ScheduledJobLog)
    private readonly logRepo: Repository<ScheduledJobLog>,
  ) {}

  async createLog(params: Partial<ScheduledJobLog>) {
    const log = this.logRepo.create(params);
    return this.logRepo.save(log);
  }
}
