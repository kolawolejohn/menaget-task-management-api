import { TaskStatus } from '../enums/task.enum';
import { Task } from '../tasks/entities/task.entity';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Task],
  synchronize: false,
});

async function seedTasks() {
  await dataSource.initialize();

  const taskRepo = dataSource.getRepository(Task);

  const sampleTasks = [
    {
      title: 'Complete project setup',
      description:
        'Initialize repository, install dependencies, set up linting',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Write unit tests',
      description: 'Add tests for tasks service',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Design database schema',
      description: 'Create tables for tasks and job logs',
      status: TaskStatus.COMPLETED,
    },
    {
      title: 'Implement scheduled job',
      description: 'Create cron job for marking old tasks',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Write migrations',
      description: 'Create migration files for tasks and enums',
      status: TaskStatus.COMPLETED,
    },
    {
      title: 'Seed sample data',
      description: 'Add seed data for testing',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Set up logging',
      description: 'Add logging for scheduled jobs',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Handle errors gracefully',
      description: 'Improve error handling in services',
      status: TaskStatus.COMPLETED,
    },
    {
      title: 'Add API documentation',
      description: 'Document endpoints using Swagger',
      status: TaskStatus.PENDING,
    },
    {
      title: 'Deploy to staging',
      description: 'Deploy application to staging environment',
      status: TaskStatus.PENDING,
    },
  ];

  for (const taskData of sampleTasks) {
    const existing = await taskRepo.findOneBy({ title: taskData.title });
    if (!existing) {
      const task = taskRepo.create(taskData);
      await taskRepo.save(task);
      console.log(`Inserted task: ${task.title}`);
    } else {
      console.log(`Task already exists: ${existing.title}`);
    }
  }

  await dataSource.destroy();
}

seedTasks()
  .then(() => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding tasks', err);
    process.exit(1);
  });
