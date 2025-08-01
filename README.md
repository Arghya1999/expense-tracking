# My Full-Stack Expense Tracker App

A full-stack web application for tracking and managing personal expenses. The backend is built with Spring Boot, and the frontend is a modern, single-page application (SPA) built with React.

## 🚀 Key Features

*   **User Authentication (JWT):** Secure user registration and login with JSON Web Tokens.
*   **Create, Read, Update, Delete (CRUD)** expenses with ease.
*   **Category Management:** Assign categories (Food, Health, Clothing, Travel, Bills, Others) to expenses using a dropdown.
*   **Date Tracking:** Record and display the date for each expense.
*   **Date Range Filtering:** Filter expenses by a specific start and end date, with a dedicated search button.
*   **Total Expense Calculation:** View the sum of all expenses, or the total for a filtered date range.
*   **Intuitive User Interface:** A clean, responsive, and aesthetically improved UI for adding, viewing, and managing expenses.
*   **Data Persistence:** Expenses and user data are stored in a database for long-term tracking.
*   **RESTful API:** A well-defined API to handle all data interactions between the frontend and backend.
*   **Containerized Development:** Use Docker to easily run the entire application stack.

## 💻 Tech Stack

### Frontend
*   **React:** A JavaScript library for building the user interface.
*   **React Router DOM:** For client-side routing and navigation.
*   **Axios:** A promise-based HTTP client for making API calls.
*   **Bootstrap:** For a consistent, responsive, and visually appealing design.
*   **Custom CSS:** For additional styling and layout refinements.

### Backend
*   **Spring Boot:** A powerful framework for creating production-grade Java applications.
*   **Spring Security:** For authentication and authorization, integrated with JWT.
*   **Maven:** A build automation tool for managing project dependencies.
*   **Java 21:** The programming language used for the backend.
*   **Spring Data JPA:** A framework for interacting with the database.
*   **H2 Database:** An in-memory database used for development and testing. (Can be swapped with PostgreSQL or MySQL for production)
*   **JJWT (Java JWT):** For generating and validating JSON Web Tokens.
*   **Jakarta Validation:** For request payload validation.

### Development & Tools
*   **Git:** Version control for collaborative development.
*   **Docker:** For containerizing the application for consistent environments.
*   **Visual Studio Code:** The primary IDE with extensions for both Java and React development.

## 📂 Project Structure

The repository is organized into two main directories:

*   `server/`: Contains all the Spring Boot backend code.
    *   `src/main/java/com/expensetracker/`: The main Java source code.
        *   `model/`: JPA entities (e.g., `Expense.java`, `User.java`, `Role.java`).
        *   `repository/`: Data access layer interfaces (e.g., `ExpenseRepository.java`, `UserRepository.java`, `RoleRepository.java`).
        *   `controller/`: REST API endpoints (e.g., `ExpenseController.java`, `AuthController.java`).
        *   `security/`: Spring Security configurations, JWT utilities, and user details services.
        *   `payload/`: Request and response DTOs for authentication.
        *   `config/`: Global configurations (e.g., CORS).
        *   `ExpensetrackerApplication.java`: The entry point for the Spring Boot application.
*   `client/`: Contains the React frontend code.
    *   `src/`: The main source code for the React application.
        *   `components/`: Reusable UI components (e.g., `ExpenseList.jsx`, `ExpenseForm.jsx`, `Login.jsx`, `Register.jsx`).
        *   `services/`: Centralized API calls and authentication services (e.g., `api.js`, `auth.service.js`, `auth-header.js`).
        *   `App.jsx`: The root component of the application, handling routing and overall state.
        *   `Auth.css`: Custom CSS for authentication components.