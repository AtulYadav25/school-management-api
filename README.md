# 🏫 School Management API

A lightweight RESTful backend API for registering and listing schools, built with **Node.js**, **Express**, **TypeScript**, and **MySQL**. Schools can be added to the database and retrieved in order of proximity using the **Haversine formula**.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Add School](#1-add-school)
  - [List Schools](#2-list-schools)
- [Request & Response Examples](#request--response-examples)
- [Postman Collection](#postman-collection)
- [Validation](#validation)
- [Error Handling](#error-handling)

---

## ✨ Features

- **Add School** — Register a new school with name, address, latitude, and longitude.
- **List Schools by Proximity** — Retrieve all schools sorted by distance from a given user location using the Haversine formula.
- **Input Validation** — Request bodies and query parameters are validated using [Zod](https://zod.dev/).
- **MySQL Connection Pooling** — Efficient database connection management using `mysql2/promise` pools.
- **CORS Enabled** — Cross-origin requests supported out of the box.
- **TypeScript** — Fully typed codebase for reliability and developer experience.

---

## 🛠 Tech Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Runtime      | Node.js                        |
| Language     | TypeScript                     |
| Framework    | Express.js v5                  |
| Database     | MySQL (via `mysql2`)           |
| Validation   | Zod                            |
| Dev Server   | ts-node-dev                    |
| Environment  | dotenv                         |

---

## 📁 Project Structure

```
assesment/
├── src/
│   ├── app.ts                        # Express app setup, middleware & routes
│   ├── server.ts                     # Server entry point
│   ├── config/
│   │   └── db.ts                     # MySQL connection pool & DB init
│   ├── middleware/
│   │   └── validate.ts               # Generic Zod validation middleware
│   ├── routes/
│   │   └── schoolRoutes.ts           # School API route handlers
│   └── validations/
│       └── schoolValidation.ts       # Zod schemas for school endpoints
├── School-Management-API.postman_collection.json
├── .env                              # Environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A running **MySQL** instance (local or hosted)

### Installation

```bash
# Clone the repository
git clone https://github.com/AtulYadav25/school-management-api.git
cd school-management-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the project with the following keys:

```env
PORT=3000

DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```


### Database Setup

The `schools` table must exist in your MySQL database before running the server. Run the following SQL to create it:

```sql
CREATE TABLE IF NOT EXISTS schools (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  address   VARCHAR(255) NOT NULL,
  latitude  FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

### Running the Server

**Development** (with hot-reload via `ts-node-dev`):

```bash
npm run dev
```

**Production** (compile TypeScript first, then run):

```bash
npm run build
npm start
```

The server will start at `http://localhost:3000` (or the `PORT` defined in `.env`).

---

## 📡 API Reference

### Base URL

```
http://localhost:3000/api/v1
```

---

### 1. Add School

Registers a new school in the database.

| Property    | Value                  |
|-------------|------------------------|
| **Method**  | `POST`                 |
| **Endpoint**| `/api/v1/addSchool`    |

#### Request Body

```json
{
  "name":      "string (required, max 255 chars)",
  "address":   "string (required, max 255 chars)",
  "latitude":  "number (required, -90 to 90)",
  "longitude": "number (required, -180 to 180)"
}
```

#### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "School added successfully",
  "data": { ... }
}
```

#### Validation Error — `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "code": "too_small",
      "path": ["name"],
      "message": "Name is required"
    }
  ]
}
```

---

### 2. List Schools

Fetches all schools from the database, sorted by distance (nearest first) from the provided coordinates. Distance is calculated using the **Haversine formula**.

| Property    | Value                   |
|-------------|-------------------------|
| **Method**  | `GET`                   |
| **Endpoint**| `/api/v1/listSchools`   |

#### Query Parameters

| Parameter   | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| `latitude`  | number | ✅ Yes   | User's latitude (-90 to 90)        |
| `longitude` | number | ✅ Yes   | User's longitude (-180 to 180)     |

#### Example Request

```
GET /api/v1/listSchools?latitude=18.5679&longitude=73.9143
```

#### Success Response — `200 OK`

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Bright Future Academy",
      "address": "Pimpri, Pune",
      "latitude": 18.6298,
      "longitude": 73.7997,
      "distance_km": 14.83
    },
    ...
  ]
}
```

#### Validation Error — `400 Bad Request`

```json
{
  "success": false,
  "message": "Valid latitude and longitude are required"
}
```

#### Server Error — `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 📬 Request & Response Examples

### Add School — `POST /api/v1/addSchool`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bright Future Academy",
    "address": "Pimpri, Pune",
    "latitude": 18.6298,
    "longitude": 73.7997
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": [
    {
      "fieldCount": 0,
      "affectedRows": 1,
      "insertId": 6,
      "info": "",
      "serverStatus": 2,
      "warningStatus": 0,
      "changedRows": 0
    },
    null
  ]
}
```

---

### List Schools — `GET /api/v1/listSchools`

**Request:**
```bash
curl "http://localhost:3000/api/v1/listSchools?latitude=18.5679&longitude=73.9143"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "name": "Sunrise School",
      "address": "Koregaon Park, Pune",
      "latitude": 18.5362,
      "longitude": 73.8938,
      "distance_km": 3.21
    },
    {
      "id": 1,
      "name": "Bright Future Academy",
      "address": "Pimpri, Pune",
      "latitude": 18.6298,
      "longitude": 73.7997,
      "distance_km": 14.83
    }
  ]
}
```

---

## 📮 Postman Collection

A ready-to-use Postman collection is included in the repository:

```
School-Management-API.postman_collection.json
```

**To use it:**

1. Open [Postman](https://www.postman.com/).
2. Click **Import** and select `School-Management-API.postman_collection.json`.
3. Set the `baseURL` collection variable to `http://localhost:3000`.
4. Run the **Add School** and **List School** requests.

Alternatively, import directly via the Postman collection link:  
👉 [Open in Postman](https://go.postman.co/collection/49026217-b59bf108-4894-48b2-8fb6-7f4b4803404f?source=collection_link)

---

## ✅ Validation

All input validation is handled by [**Zod**](https://zod.dev/) and applied via a reusable Express middleware (`src/middleware/validate.ts`).

**`addSchool` schema rules:**

| Field       | Type   | Constraints              |
|-------------|--------|--------------------------|
| `name`      | string | Required, max 255 chars  |
| `address`   | string | Required, max 255 chars  |
| `latitude`  | number | Required, -90 to 90      |
| `longitude` | number | Required, -180 to 180    |

**`listSchools` query param rules:**

| Param       | Type   | Constraints             |
|-------------|--------|-------------------------|
| `latitude`  | number | Required, -90 to 90     |
| `longitude` | number | Required, -180 to 180   |

---

## ⚠️ Error Handling

| HTTP Status | Meaning                                      |
|-------------|----------------------------------------------|
| `201`       | School successfully created                  |
| `200`       | Schools listed successfully                  |
| `400`       | Validation error (missing/invalid fields)    |
| `500`       | Internal server error (database issues, etc.)|

---

## 📄 License

This project is licensed under the **ISC License**.
