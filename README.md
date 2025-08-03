
## 🏁 Getting Started

Follow these steps to get the Expense Tracker application up and running on your local machine.

### Prerequisites

*   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/expense-tracker.git
    cd expense-tracker
    ```

2.  **Build and run with Docker Compose:**

    Since we have Dockerfiles for both client and server, you can use Docker Compose to build and run both services simultaneously. Create a `docker-compose.yml` file in the root directory of the project with the following content:

    ```yaml
    version: '3.8'

    services:
      backend:
        build: ./server
        ports:
          - "8080:8080"
        environment:
          SPRING_DATASOURCE_URL: jdbc:h2:mem:testdb
          SPRING_DATASOURCE_USERNAME: sa
          SPRING_DATASOURCE_PASSWORD: password
        networks:
          - expensetracker-network

      frontend:
        build: ./client
        ports:
          - "80:80"
        depends_on:
          - backend
        networks:
          - expensetracker-network

    networks:
      expensetracker-network:
        driver: bridge
    ```

    Then, from the root directory of the project, run:

    ```bash
    docker-compose up --build
    ```

    This command will:
    *   Build the Docker images for both the backend and frontend (if not already built).
    *   Start the backend service on port `8080`.
    *   Start the frontend service on port `80`.

3.  **Access the application:**

    Once both services are up and running, open your web browser and navigate to `http://localhost` to access the Expense Tracker application.

## 🧪 Running Tests

### Client-side Tests

To run the frontend tests, navigate to the `client` directory and use npm:

```bash
cd client
npm test
```

### Server-side Tests

To run the backend tests, navigate to the `server` directory and use the Maven Wrapper:

```bash
cd server
mvnw.cmd test # For Windows
./mvnw test   # For Linux/macOS
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
