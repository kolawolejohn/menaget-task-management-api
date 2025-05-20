import { Injectable, Logger } from '@nestjs/common';
import { Realtime, RealtimeChannel } from 'ably';
import { Task } from '../tasks/interface/task.interface';

@Injectable()
export class AblyService {
  private readonly logger = new Logger(AblyService.name);
  private readonly realtime: Realtime;
  private channel?: RealtimeChannel;

  constructor() {
    this.realtime = new Realtime({
      key: process.env.ABLY_API_KEY,
    });

    this.realtime.connection.on('failed', (err) => {
      this.logger.error('Ably connection failed', err);
    });
    this.realtime.connection.on('connected', () => {
      this.logger.log('Ably connected');
    });
    this.realtime.connection.on('disconnected', () => {
      this.logger.warn('Ably disconnected');
    });
    this.realtime.connection.on('suspended', () => {
      this.logger.warn('Ably connection suspended');
    });
  }

  private getChannel(): RealtimeChannel {
    if (!this.channel) {
      this.channel = this.realtime.channels.get('task-updates');
    }
    return this.channel;
  }

  async publishTaskUpdate(task: Task, action: string) {
    try {
      await this.getChannel().publish('task-event', { ...task, action });
      this.logger.log(`Published task update: ${task.id}, action: ${action}`);
    } catch (error) {
      this.logger.error('Failed to publish task update', error);
    }
  }
}
