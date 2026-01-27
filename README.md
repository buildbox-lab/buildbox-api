# Task1 - HTTP Server

Simple Express server with health check and hello world endpoints.

## Prerequisites

- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) v18+

## Setup

### Clone the repository

```bash
git clone https://github.com/mehanisik/docker-api-pipeline.git
cd docker-api-pipeline
```

### Install dependencies

**Using Bun (recommended):**

```bash
bun install
```

**Using npm:**

```bash
npm install
```

### Configure environment

Copy the example environment file and adjust values if needed:

```bash
cp .env.example .env
```

Default values:

```
PORT=8000
HOST=localhost
NODE_ENV=development
SERVER_HELLO=Hello World
```

## Run the application

**Using Bun:**

```bash
bun run dev
```

**Using npm:**

```bash
npx tsx src/index.ts
```

The server will start at `http://localhost:8000`

## API Endpoints

### Health Check

```bash
curl http://localhost:8000/health-check
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "environment": "development",
  "version": "v24.3.0"
}
```

### Hello World

```bash
curl http://localhost:8000/hello-world
```

Response:

```
Hello World
```

The message is configurable via the `SERVER_HELLO` environment variable.

### Root

```bash
curl http://localhost:8000/
```

Response:

```
Hello World!
```

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `bun run dev`    | Start development server |
| `bun run lint`   | Run Biome linter         |
| `bun run format` | Format code with Biome   |
