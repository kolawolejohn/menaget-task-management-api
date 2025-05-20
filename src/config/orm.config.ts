import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'local';

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  subscribers: [],
};

const localConfig: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  logging: true,
};

const dockerConfig: DataSourceOptions = {
  ...baseConfig,
  host: 'db', // docker service name
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const productionConfig: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: false,
};

let config: DataSourceOptions;

if (env === 'production') {
  config = productionConfig;
} else if (env === 'docker') {
  config = dockerConfig;
} else {
  config = localConfig;
}

export default config;
