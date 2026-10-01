# Server Monitor

A full-stack server monitoring application that lets you register servers, check their availability in real time (ping), and manage them through a clean, modern dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- 📋 **Server registry** — create, list, fetch, and delete monitored servers
- 🏓 **Live ping checks** — verify whether a server IP is reachable (`SERVER_UP` / `SERVER_DOWN`)
- 🖼️ **Server thumbnails** — auto-assigned server images served by the backend
- 📊 **Status dashboard** — live count of up vs. down servers with loading skeletons
- 🔔 **User feedback** — success/error alerts for every action
- ✅ **Validation** — request validation on both client and server side

---

## Tech Stack

### Backend (`server/`)

| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Runtime / language |
| Spring Boot | 4.1.1 | Application framework |
| Spring Web MVC | — | REST API |
| Spring Data JPA (Hibernate) | — | ORM / persistence |
| Spring Validation | — | Bean validation |
| MySQL Connector/J | — | Database driver |
| Project Lombok | — | Boilerplate reduction |
| Maven | 3.9+ | Build tool |

### Frontend (`server-frontend/`)

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Dev server / bundler |
| Tailwind CSS | 4 | Styling |
| shadcn/ui + Base UI | — | Component library |
| lucide-react | — | Icons |
| oxlint | — | Linter |

---

## Project Structure

```
.
├── server/                          # Spring Boot backend
│   ├── src/main/java/com/bakheet/server/
│   │   ├── ServerApplication.java   # Entry point
│   │   ├── controller/              # REST controllers
│   │   ├── entities/                # JPA entities & API response wrapper
│   │   ├── enumeration/             # Status enum (SERVER_UP/SERVER_DOWN)
│   │   ├── repository/              # Spring Data JPA repositories
│   │   └── services/                # Service layer & implementations
│   ├── src/main/resources/
│   │   └── application.properties   # App configuration
│   └── pom.xml
│
└── server-frontend/                 # React frontend
    ├── src/
    │   ├── components/              # ServerCard, AddServerDialog, ui/
    │   ├── lib/                     # api.js client, utils
    │   ├── App.jsx                  # Main dashboard
    │   └── main.jsx
    └── vite.config.js               # Dev proxy → localhost:8080
```

---

## API Reference

Base URL: `http://localhost:8080/server`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/list` | List all servers (limit 30) |
| `GET` | `/get/{id}` | Get a server by ID |
| `POST` | `/save` | Create a new server (validated body) |
| `DELETE` | `/delete/{id}` | Delete a server by ID |
| `GET` | `/ping/{ipAddress}` | Ping a server and update its status |
| `GET` | `/image/{fileName}` | Serve a server image (PNG) |

**Example — create a server:**

```bash
curl -X POST http://localhost:8080/server/save \
  -H "Content-Type: application/json" \
  -d '{"name":"Production DB","ipAddress":"192.168.1.10","memory":"16GB","type":"Ubuntu"}'
```

**Example response:**

```json
{
  "timeStamp": "2026-10-02T12:00:00",
  "statusCode": 201,
  "status": "CREATED",
  "message": "Server created",
  "data": { "server": { "id": 1, "name": "Production DB", "status": null } }
}
```

---

## Getting Started

### Prerequisites

- **Java 21+** and **Maven 3.9+**
- **Node.js 20+** and npm
- **MySQL 8+** running on `localhost:3306`

### Backend Setup

1. Create the database:

   ```sql
   CREATE DATABASE serverdb;
   ```

2. Configure credentials in `server/src/main/resources/application.properties`.

3. Run the backend:

   ```bash
   cd server
   ./mvnw spring-boot:run
   ```

   The API starts on `http://localhost:8080`.

### Frontend Setup

```bash
cd server-frontend
npm install
npm run dev
```

The UI starts on `http://localhost:5173` and proxies `/server/*` requests to the backend.

---

## Configuration

`server/src/main/resources/application.properties`

```properties
spring.application.name=server
spring.datasource.url=jdbc:mysql://localhost:3306/serverdb
spring.datasource.username=root
spring.datasource.password=********
spring.jpa.hibernate.ddl-auto=create
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.show-sql=true
```

> ⚠️ Do not commit real credentials. Use environment variables or a secrets manager in production.

---

## Scripts

### Backend

| Command | Description |
|---|---|
| `./mvnw spring-boot:run` | Start the API |
| `./mvnw clean package` | Build the JAR |
| `./mvnw test` | Run tests |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | Lint with oxlint |

---

## License

This project is open-source and available under the [MIT License](LICENSE).
