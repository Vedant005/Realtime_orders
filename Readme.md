# Real-Time Order Update System

## Overview

This project implements a real-time event-driven backend system where connected clients automatically receive updates whenever data in the database changes.

The system eliminates client-side polling by leveraging PostgreSQL triggers, PostgreSQL LISTEN/NOTIFY, Redis Pub/Sub, and Socket.IO.

Whenever an order is created, updated, or deleted:

1. PostgreSQL Trigger detects the change.
2. PostgreSQL NOTIFY sends an event.
3. Node.js Listener receives the event.
4. Redis Pub/Sub distributes the event.
5. Socket.IO broadcasts the event to connected clients.
6. Clients instantly receive updates.

---

# Architecture
<img width="674" height="391" alt="realtime" src="https://github.com/user-attachments/assets/8a8b6893-2da4-414c-a7a1-30559ed5ce15" />

---

# Why This Design?

## Problem

A traditional approach would require clients to continuously poll the server:

```text
Client → GET /orders
Client → GET /orders
Client → GET /orders
```

This causes:

* Unnecessary database load
* Increased network traffic
* Delayed updates
* Poor scalability

---

## Solution

Use an event-driven architecture.

Whenever data changes:

```text
Database Change
       ↓
Event Generated
       ↓
Broadcast to Clients
```

Clients receive updates instantly without polling.

---

# Scalability Considerations

### Current Implementation

```text
PostgreSQL
    ↓
LISTEN/NOTIFY
    ↓
Redis
    ↓
Socket.IO
```

### Why Redis?

Without Redis:

```text
PostgreSQL
    ↓
Socket.IO Server
```

works for a single server.

However, when multiple application instances are deployed:

```text
          Load Balancer
          /    |    \
         /     |     \
     Node1  Node2  Node3
```

events must be shared across all instances.

Redis Pub/Sub enables horizontal scalability by distributing events across multiple application servers.

---

# Tech Stack

| Component              | Technology               |
| ---------------------- | ------------------------ |
| Backend                | Node.js                  |
| Framework              | Express.js               |
| Database               | PostgreSQL               |
| ORM                    | Prisma                   |
| Messaging              | Redis Pub/Sub            |
| Realtime Communication | Socket.IO                |
| Database Notifications | PostgreSQL LISTEN/NOTIFY |
| Containerization       | Docker                   |

---

# Result
## Browser
<img width="1070" height="875" alt="image" src="https://github.com/user-attachments/assets/0075f393-9a43-49cd-8329-28dd528b9268" />

## CLI
<img width="632" height="697" alt="image" src="https://github.com/user-attachments/assets/172aa4d2-a375-4247-87cf-14614c934fd4" />


# Order Model

```prisma
model Order {
  id           Int         @id @default(autoincrement())
  customerName String
  productName  String
  status       OrderStatus @default(pending)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("orders")
}
```

---

# Database Trigger

The trigger automatically executes whenever data changes in the orders table.

Supported events:

* INSERT
* UPDATE
* DELETE

The trigger publishes notifications to:

```sql
orders_channel
```

---

# Setup Instructions

## Prerequisites

* Node.js 20+
* PNPM
* Docker Desktop
* PostgreSQL
* Redis

---

# Clone Repository

```bash
git clone [<repository-url>](https://github.com/Vedant005/Realtime_orders.git)

cd Realtime_orders
```

---

# Install Dependencies

```bash
pnpm install
```

---

# Environment Variables

Create:

```text
.env
```

Example:

```env
PORT=8000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=realtime_orders

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realtime_orders

REDIS_URL=redis://localhost:6379
```

---

# Start Infrastructure

## PostgreSQL

```bash
docker run -d \
--name realtime_postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=realtime_orders \
-p 5432:5432 \
postgres:16
```

## Redis

```bash
docker run -d \
--name realtime_redis \
-p 6379:6379 \
redis:7
```

Verify:

```bash
docker ps
```

---

# Generate Prisma Client

```bash
pnpm prisma generate
```

---

# Run Database Migrations

```bash
pnpm prisma migrate dev
```

---

# Start Application

```bash
pnpm dev
```

Expected Output:

```text
PostgreSQL Connected Successfully

Redis Connected

Listening on orders_channel

Redis Listener Started

Server running on port 8000
```

---

# API Endpoints

## Create Order

```http
POST /api/orders
```

Request:

```json
{
  "customerName": "John Doe",
  "productName": "Laptop",
  "status": "pending"
}
```

---

## Get All Orders

```http
GET /api/orders
```

---

## Get Order By ID

```http
GET /api/orders/:id
```

---

## Update Order

```http
PUT /api/orders/:id
```

Request:

```json
{
  "status": "shipped"
}
```

---

## Delete Order

```http
DELETE /api/orders/:id
```

---

# Real-Time Event Types

### ORDER_CREATED

```json
{
  "eventType": "ORDER_CREATED",
  "data": {
    ...
  }
}
Redis Event: ORDER_CREATED
```

### ORDER_UPDATED

```json
{
  "eventType": "ORDER_UPDATED",
  "data": {
    ...
  }
}
Redis Event: ORDER_UPDATED
```

### ORDER_DELETED

```json
{
  "eventType": "ORDER_DELETED",
  "data": {
    ...
  }
}
Redis Event: ORDER_DELETED
```

---

# Testing Real-Time Updates

Run:

```bash
node src/socket-client.js
```

Expected:

```text
Connected to Socket.IO Server
```

Create an order using Postman:

```http
POST /api/orders
```

Client receives:

```text
ORDER_CREATED

{
  ...
}
```

Update an order:

```http
PUT /api/orders/1
```

Client receives:

```text
ORDER_UPDATED

{
  ...
}
```

Delete an order:

```http
DELETE /api/orders/1
```

Client receives:

```text
ORDER_DELETED

{
  ...
}
```

# Design Decisions

### Why PostgreSQL LISTEN/NOTIFY?

Provides lightweight real-time notifications directly from the database whenever rows change.

### Why Redis?

Allows horizontal scaling and event distribution across multiple application instances.

### Why Socket.IO?

Provides reliable real-time communication with automatic reconnection and event-based messaging.

### Why Prisma?

Improves developer productivity and provides type-safe database access.

---

# Conclusion

This project demonstrates a scalable, event-driven architecture that propagates database changes to connected clients in real time without polling.

The solution combines PostgreSQL triggers, LISTEN/NOTIFY, Redis Pub/Sub, and Socket.IO to achieve efficient real-time communication while remaining extensible for future large-scale deployments.
