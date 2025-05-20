// src/tasks/dto/filter-tasks.dto.ts
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TaskStatus } from '../../enums/task.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterTaskDto {
  @ApiProperty({ example: 'pending', description: 'task status' })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ example: 'Buy Groceries', description: 'task title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: '1', description: 'number of tasks to fetch' })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  take?: number;

  @ApiProperty({ example: '1', description: 'number of tasks to skip' })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  skip?: number;
}
