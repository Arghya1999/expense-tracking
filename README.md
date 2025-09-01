
# Expense Tracker Application

The Expense Tracker is a robust, full-stack application meticulously engineered to provide users with a seamless and secure platform for managing their personal finances. Leveraging modern web technologies, this application empowers users to effortlessly track, categorize, and analyze their expenditures, fostering better financial habits and informed financial decision-making.

## Core Capabilities

*   **Secure User Authentication:** Robust user registration and login functionalities, ensuring data privacy and secure access to personal expense records.
*   **Comprehensive Expense Management:** Intuitive interface for adding, viewing, updating, and deleting expense entries, providing granular control over financial data.
*   **RESTful API with JWT Security:** A highly secure backend API, protected by JSON Web Tokens (JWT), ensuring authenticated and authorized interactions.
*   **Automated Database Migrations:** Utilizes Flyway for reliable and version-controlled database schema management, simplifying deployment and updates.
*   **Containerized Deployment:** Fully Dockerized for consistent and scalable deployment across various environments, streamlining development and production workflows.

## Technologies Used

### Backend (Server)

*   **Framework:** Spring Boot
*   **Security:** Spring Security, JWT (JSON Web Tokens)
*   **Database:** PostgreSQL
*   **ORM/Data Access:** Spring Data JPA
*   **Database Migrations:** Flyway
*   **API Documentation:** SpringDoc OpenAPI (Swagger UI)
*   **Caching:** Spring Data Redis
*   **Build Tool:** Maven
*   **Utility:** Lombok
*   **Language:** Java 21

### Frontend (Client)

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS, PostCSS
*   **Linting:** ESLint
*   **Testing:** Jest
*   **Package Manager:** npm
*   **Language:** JavaScript (JSX)

## Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed:

*   Git
*   Java Development Kit (JDK) 21 or higher
*   Apache Maven
*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   PostgreSQL database server
*   Docker and Docker Compose (for containerized setup)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd expense-tracker
    ```
2.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
3.  **Configure Database:**
    *   Create a PostgreSQL database (e.g., `expensetracker_db`).
    *   Update the database connection properties in `src/main/resources/application.yml` to match your PostgreSQL setup.
        ```yaml
        spring:
          datasource:
            url: jdbc:postgresql://localhost:5432/expensetracker_db
            username: your_username
            password: your_password
          jpa:
            hibernate:
              ddl-auto: none # Flyway handles schema
          flyway:
            enabled: true
            locations: classpath:db/migration
        ```
4.  **Build the backend:**
    ```bash
    mvn clean install
    ```

### Frontend Setup

1.  **Navigate to the client directory:**
    ```bash
    cd ../client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application

### Running Locally (Backend and Frontend Separately)

#### Backend

1.  Ensure you are in the `server` directory.
2.  Run the Spring Boot application:
    ```bash
    mvn spring-boot:run
    ```
    The backend server will start on `http://localhost:8080` by default.

#### Frontend

1.  Ensure you are in the `client` directory.
2.  Start the React development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically be available at `http://localhost:5173` (or another port if 5173 is in use).

### Running with Docker Compose (Recommended)

1.  Ensure you are in the root directory of the project (where `docker-compose.yml` is located).
2.  Build and start the services:
    ```bash
    docker-compose up --build
    ```
    This will build Docker images for both the client and server, and start them along with a PostgreSQL database and Nginx proxy.
    *   The frontend will be accessible via Nginx, usually at `http://localhost`.
    *   The backend API will be accessible internally within the Docker network.

## API Endpoints (Swagger UI)

The backend API documentation is available via Swagger UI.

Once the backend server is running (either locally or via Docker Compose), you can access the Swagger UI at:

*   **Local:** `http://localhost:8080/swagger-ui.html`
*   **Docker Compose:** If running via Docker Compose, the Nginx proxy might expose it differently, but typically you can access it through the Nginx port (e.g., `http://localhost/api/swagger-ui.html` or similar, depending on your Nginx configuration in `client/nginx.conf`). Please refer to the `client/nginx.conf` for the exact path.

The Swagger UI provides a comprehensive list of all available API endpoints, their request/response models, and allows you to test them directly.

## Database Schema

The database schema is managed by Flyway migrations. You can find the migration scripts in the `server/src/main/resources/db/migration` directory. These scripts define the tables and their relationships.

## Testing

### Backend Tests

1.  Navigate to the `server` directory.
2.  Run all backend tests:
    ```bash
    mvn test
    ```

### Frontend Tests

1.  Navigate to the `client` directory.
2.  Run all frontend tests:
    ```bash
    npm test
    ```