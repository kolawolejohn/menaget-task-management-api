import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { SuccessResponse } from '../common/response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ApiSuccessArrayResponse,
  ApiSuccessResponse,
} from 'src/common/decorators/api-success-response.decorator';
import { TaskDto } from './dto/task.dto';
import { PaginatedTasks } from './interface/paginate-task.interface';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiSuccessResponse(TaskDto, 'Task created successfully')
  async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<SuccessResponse<Task>> {
    const task = await this.tasksService.create(createTaskDto);
    return new SuccessResponse('Task created successfully', task);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  @ApiSuccessArrayResponse(TaskDto, 'Tasks retrieved successfully')
  async findAll(
    @Query() filterDto: FilterTaskDto,
  ): Promise<SuccessResponse<PaginatedTasks>> {
    const tasks = await this.tasksService.findAll(filterDto);
    return new SuccessResponse('Tasks retrieved successfully', tasks);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiSuccessResponse(TaskDto, 'Task fetched successfully')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<Task>> {
    const task = await this.tasksService.findOne(id);
    return new SuccessResponse('Task retrieved successfully', task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiSuccessResponse(TaskDto, 'Task updated successfully')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<SuccessResponse<Task>> {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    return new SuccessResponse('Task updated successfully', updatedTask);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.deleteTask(id);
  }
}
