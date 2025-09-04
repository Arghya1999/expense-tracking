# Expense Tracker Application

![Version](https://img.shields.io/badge/version-1.0.0-blue)

The Expense Tracker is a robust, full-stack application engineered to provide users with a seamless and secure platform for managing personal finances. Leveraging modern web technologies, this application empowers users to effortlessly track, categorize, and analyze their expenditures.

<img width="1890" height="856" alt="image" src="https://github.com/user-attachments/assets/85526e06-bfa9-45fa-8cd0-28c9f39888b6" />

<img width="1845" height="835" alt="image" src="https://github.com/user-attachments/assets/e6a463b5-baf1-42ad-a0c4-83191aea1ee8" />

## ✨ Core Features

*   **Secure User Authentication:** Robust user registration and login functionalities using JWT.
*   **Comprehensive Expense Management:** Intuitive interface for adding, viewing, updating, and deleting expense entries.
*   **RESTful API:** A secure backend API for all data interactions.
*   **Containerized Deployment:** Fully containerized with Docker and Docker Compose for easy setup and deployment.
*   **CI/CD Pipeline:** Automated build and test pipeline using GitHub Actions.

## 🛠️ Technology Stack

| Category      | Technology                                       |
| ------------- | ------------------------------------------------ |
| **Backend**   | Java 21, Spring Boot, Spring Security (JWT)      |
| **Frontend**  | React, Vite, Tailwind CSS                        |
| **Database**  | PostgreSQL, Redis (for Caching)                  |
| **DevOps**    | Docker, Docker Compose, GitHub Actions           |
| **Build Tools** | Maven (Backend), npm (Frontend)                  |

## 🚀 Getting Started

This project is fully containerized, making the setup process simple and consistent.

### Prerequisites

*   [Git](https://git-scm.com/)
*   [Docker](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Arghya1999/expense-tracking.git
    cd expense-tracking
    ```

2.  **Create your environment file:**
    Create a file named `.env` in the root of the project and add the following content. Replace the placeholder values with your own credentials.
    ```env
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    JWT_SECRET=your_super_secret_jwt_key
    ```

3.  **Build and run the application:**
    ```bash
    docker compose up --build
    ```

Your application should now be running! 
*   The frontend will be accessible at `http://localhost:80`
*   The backend API is available at `http://localhost:8080`

## 📖 API Documentation

The API is secured using JWT. After signing in, you must include the received token in the `Authorization` header for all subsequent requests to protected endpoints.

**Header Format:** `Authorization: Bearer <YOUR_JWT_TOKEN>`

--- 

### Authentication

#### `POST /api/v1/auth/signup`

Registers a new user.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "User registered successfully!"
}
```

#### `POST /api/v1/auth/signin`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIi...",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
```

--- 

### Expenses
*(Authentication Required)*

#### `GET /api/v1/expenses`

Retrieves all expenses for the authenticated user.

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "description": "Coffee Meeting",
    "amount": 15.75,
    "date": "2025-09-05",
    "category": "Food"
  },
  {
    "id": 2,
    "description": "Office Supplies",
    "amount": 54.00,
    "date": "2025-09-04",
    "category": "Work"
  }
]
```

#### `POST /api/v1/expenses`

Creates a new expense for the authenticated user.

**Request Body:**
```json
{
  "description": "Dinner with team",
  "amount": 85.50,
  "date": "2025-09-03",
  "category": "Social"
}
```

**Success Response (200 OK):**
```json
{
  "id": 3,
  "description": "Dinner with team",
  "amount": 85.50,
  "date": "2025-09-03",
  "category": "Social"
}
```

#### `PUT /api/v1/expenses/{id}`

Updates an existing expense by its ID.

**Request Body:**
```json
{
  "description": "Updated Dinner with team",
  "amount": 90.00,
  "date": "2025-09-03",
  "category": "Food"
}
```

**Success Response (200 OK):**
```json
{
  "id": 3,
  "description": "Updated Dinner with team",
  "amount": 90.00,
  "date": "2025-09-03",
  "category": "Food"
}
```

#### `DELETE /api/v1/expenses/{id}`

Deletes an expense by its ID.

**Success Response (200 OK):**
(No content is returned, just a 200 status code)
