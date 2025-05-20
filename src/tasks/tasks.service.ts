import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from '../enums/task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AblyService } from '../ably/ably.service';
import { TaskEventAction } from '../enums/task-event.enum';
import { PaginatedTasks } from './interface/paginate-task.interface';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly ablyService: AblyService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.PENDING,
    });
    const savedTask = await this.tasksRepository.save(task);
    try {
      await this.ablyService.publishTaskUpdate(
        { id: task.id, title: task.title, status: task.status },
        TaskEventAction.CREATED,
      );
    } catch (error) {
      this.logger.warn(`Failed to publish Ably event: ${error.message}`);
    }

    return savedTask;
  }

  async findAll(filterDto: FilterTaskDto): Promise<PaginatedTasks> {
    const { status, search, take = 5, skip = 0 } = filterDto;
    const page = Math.floor(skip / take) + 1;

    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('task.title ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query.skip(skip).take(take).getManyAndCount();

    const totalPages = Math.ceil(total / take);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      data,
      total,
      currentPage: page,
      nextPage,
      prevPage,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);
    try {
      await this.ablyService.publishTaskUpdate(
        {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
        },
        TaskEventAction.UPDATED,
      );
    } catch (error) {
      this.logger.warn(`Failed to publish Ably event: ${error.message}`);
    }

    return updatedTask;
  }

  async deleteTask(id: string) {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('Task not found');

    await this.tasksRepository.delete(id);

    try {
      await this.ablyService.publishTaskUpdate(
        { id, title: task.title, status: task.status },
        TaskEventAction.DELETED,
      );
    } catch (error) {
      this.logger.warn(`Failed to publish Ably event: ${error.message}`);
    }
  }

  async markTasksOlderThan7Days(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const result = await this.tasksRepository
        .createQueryBuilder()
        .update()
        .set({ status: TaskStatus.COMPLETED })
        .where('status != :completed', { completed: TaskStatus.COMPLETED })
        .andWhere('created_at < :date', { date: sevenDaysAgo })
        .execute();

      return result.affected ?? 0;
    } catch (error) {
      throw new Error(
        `Failed to mark tasks older than 7 days: ${error.message}`,
      );
    }
  }
}
