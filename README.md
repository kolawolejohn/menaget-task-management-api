# 📋 Task Management API

A simple task management API built with [NestJS](https://nestjs.com), TypeORM, PostgreSQL, and Ably for real-time updates. It follows SOLID principles and clean architecture practices.

---

## 🛠️ Tech Stack

- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Real-time**: Ably
- **Containerization**: Docker & Docker Compose
- **Documentation**: Swagger

---

## 📁 Project Structure & Principles

This project follows **SOLID principles**, Domain-Driven Design (DDD) practices, and a modular folder structure. Key highlights:

- **Single Responsibility**: Each service/controller handles one concern. Each class (controller, service, dto) focuses on a specific domain concern — for example, TaskService handles only task-related logic, while SchedulerService manages cron operations.
- **Dependency Injection**: Powered by NestJS's built-in DI container. NestJS uses a built-in IoC (Inversion of Control) container to manage dependencies.
Classes declare their dependencies via constructors, and Nest resolves them — enabling testability, flexibility, and decoupling.
- **Loose Coupling**: Business logic is separated from infrastructure. Business logic is abstracted from infrastructure concerns (e.g., database, schedulers, Ably pub/sub). This allows easy refactoring or swapping implementations.
- **Scalable Structure**: Organized into feature modules (`tasks`, `ably`, `scheduler`, `common` etc).
- **Environment-Aware Confige**: The codebase is environment-conscious — handling differences between local, Docker, and Render (production) seamlessly via .env, entrypoint.sh, and NODE_ENV.

---

## ⚙️ Setup & Run Instructions

### 1. Clone the repository

````bash
git clone https://github.com/kolawolejohn/menaget-task-management-api.git
cd menaget-task-management-api

Install dependencies:

```bash
$ npm install
````

## Compile and run the project locally or via Docker

```bash
# locally
# watch mode
$ npm run start:dev or yarn start:dev

# production mode
$ npm run start:prod
```

## migration locally

```bash
# to create a new migration file
$ npm run migrate:create -- src/migrations/<action to perform e.g CreateTaskTable>

# run your migration locally after adding your code to your migration file
$ npm run migrate

# run seed locally
$ npm run seed:tasks
```

🐳 Docker Setup

To run the application with Docker:

🔧 Build & Start

```bash
$ docker-compose up --build
# if you need to run the seed sample tasks, in another terminal run
# for docker the migration is ran on startup and it is indempotent
$ docker exec -it task_manager_app_container npm run seed:docker
```

## NB

You do not need to run migrations on production and docker as this has been handle on startup, however, no need to seed data for production... Just enjoy using the application

🔁 Run in Background

```bash
$ docker-compose up -d
```

# API Documentation

## Swagger UI

The API is documented using @nestjs/swagger and is available at:
http://localhost:3000/api-docs

# Documentation Features

Each endpoint is fully documented with:

- HTTP method and path

- Request parameters (query, path, body) with type info

- Authentication requirements (if any)

- Status codes (e.g., 200, 400, 404)

- Example request and response payloads

- Decorators used: @ApiTags, @ApiOperation, @ApiBody, @ApiResponse, etc.

# All successful responses follow a standard format:

{
"status": "success",
"message": "Task retrieved successfully",
"data": {
"id": "uuid",
"title": "Task title",
"description": "Task description",
"status": "pending",
"createdAt": "timestamp",
"updatedAt": "timestamp"
}
}

🌐 App URLs

## Production

API_BASE_URL: https://menaget-task-management-api.onrender.com/
Swagger Docs: https://menaget-task-management-api.onrender.com/api-docs

## local

API Base URL: http://localhost:3000
Swagger Docs: http://localhost:3000/api-docs

# Client-Side Ably Subscription (Token Auth)

<script src="https://cdn.ably.io/lib/ably.min-1.js"></script>
<script>
  // Replace with your backend token endpoint
  const tokenEndpoint = 'https://menaget-task-management-api.onrender.com/ably/token';

  fetch(tokenEndpoint)
    .then((res) => res.json())
    .then((tokenRequest) => {
      const ably = new Ably.Realtime({
        authUrl: tokenEndpoint, // Ably will fetch token automatically when needed
      });

      const channel = ably.channels.get('tasks');

      channel.subscribe((message) => {
        console.log('📣 New task event:', message.name, message.data);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to Ably:', err);
    });
</script>

## productions

## Stay in touch

- Author - [Kolawole John](https://twitter.com/kolawole_john)

# menaget-task-management-api
