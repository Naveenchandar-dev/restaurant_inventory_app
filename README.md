# Restaurant Inventory Tracker

This is a full-stack web application built to satisfy the requirements of the Senior Full Stack Engineer take-home task from Astroblack Technologies. It provides a simple yet powerful interface for a restaurant to manage inventory, log consumption, and receive predictive alerts for restocking.

## Tech Stack

-   **Frontend:** React.js, Axios, Recharts (for charts)
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **ORM:** Sequelize
-   **Authentication:** Simple API Key Middleware

## Features Implemented

-   [x] **Inventory Management:** Admins can add and view all inventory items.
-   [x] **Consumption Logging:** Admins can log the daily consumption of any item.
-   [x] **Stock Calculation:** The system automatically decrements stock upon consumption logging.
-   [x] **Low-Stock Flagging:** Items are flagged as "Low Stock" when their quantity falls below a user-defined threshold.
-   [x] **Predictive Restock Alerts:** The system uses a moving average of past consumption to predict when an item will run out and generates an alert if it's within 3 days.
-   [x] **Recommended Reorder Quantity:** Alerts include a suggested quantity to reorder based on consumption rates.
-   [x] **(Bonus) Consumption Trends Chart:** A demo chart visualizes consumption trends over time.
-   [x] **(Bonus) Basic Authentication:** All API endpoints are protected by a static API key.

## Setup and Installation

### Prerequisites

-   Node.js (v14 or later)
-   npm or yarn
-   PostgreSQL installed and running.

### 1. Database Setup

1.  Open your PostgreSQL client (e.g., `psql` or a GUI like DBeaver).
2.  Create a new database for the project:
    ```sql
    CREATE DATABASE restaurant_inventory;
    ```
3.  Ensure you have a database user with privileges to access this database.

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the example:
    ```bash
    cp .env.example .env
    ```
4.  Edit the `.env` file with your PostgreSQL credentials and a secret API key:
    ```
    PORT=5000
    API_KEY=your-secret-api-key-goes-here

    DB_USER=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_NAME=restaurant_inventory
    DB_HOST=127.0.0.1
    ```
5.  Run the database migrations to create the tables:
    ```bash
    npx sequelize-cli db:migrate
    ```

### 3. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Important:** Open `frontend/src/api/inventoryApi.js` and ensure the `API_KEY` constant matches the one you set in the backend's `.env` file.

## Running the Application

You need to run both the backend and frontend servers simultaneously in separate terminal windows.

1.  **Start the Backend Server:**
    ```bash
    # From the /backend directory
    npm start
    # Or for development with auto-reloading:
    # npm run start:dev (if you add "start:dev": "nodemon server.js" to package.json)
    ```
    The backend will be running on `http://localhost:5000`.

2.  **Start the Frontend Server:**
    ```bash
    # From the /frontend directory
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

## API Endpoints

All endpoints are prefixed with `/api` and require an `x-api-key` header.

-   `POST /items`: Add a new inventory item.
-   `GET /items`: List all items with calculated status.
-   `POST /consumption`: Log daily usage of an item.
-   `GET /restock-alerts`: Predict low stock based on past consumption.

## Assumptions & Design Choices

-   **Prediction Model:** A simple moving average based on the last 30 days of consumption data was used. This is effective for stable consumption patterns but could be improved with more advanced forecasting models (e.g., ARIMA) for items with seasonal demand.
-   **Authentication:** A simple static API key was chosen for simplicity, as per the bonus points. For a production system, a more robust authentication mechanism like JWT (JSON Web Tokens) or OAuth2 would be necessary.
-   **Transaction Safety:** The consumption logging endpoint uses a database transaction to ensure that stock quantity is only updated if the consumption log is also created successfully, maintaining data integrity.
  ![image](https://github.com/user-attachments/assets/309a3288-0694-4f71-b51d-04e7c70c91b9)  This is the sample image for this app.

