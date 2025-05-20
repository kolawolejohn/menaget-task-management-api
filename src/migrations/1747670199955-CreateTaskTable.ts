import { TaskStatus } from '../enums/task.enum';
import { enumToArray } from '../helpers/converter.helper';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaskTable1747670199955 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('tasks');
    if (!hasTable) {
      await queryRunner.createTable(
        new Table({
          name: 'tasks',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              isGenerated: true,
              generationStrategy: 'uuid',
            },
            {
              name: 'title',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'enum',
              enum: enumToArray(TaskStatus),
              enumName: 'task_status',
              default: `'pending'`,
              isNullable: false,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('tasks');
    if (hasTable) {
      await queryRunner.dropTable('tasks');
    }

    const hasEnum = await queryRunner.query(
      `SELECT 1 FROM pg_type WHERE typname = 'task_status'`,
    );

    if (hasEnum.length) {
      await queryRunner.query(`DROP TYPE "task_status"`);
    }
  }
}
