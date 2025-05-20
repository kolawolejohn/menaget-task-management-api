import { Task } from '../entities/task.entity';

export interface PaginatedTasks {
  data: Task[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
}
