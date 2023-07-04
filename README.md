# HUGO ASSIGNMENT PROJECT

This project consists of a frontend and backend application with a database managed through Docker.

## Prerequisites

- Node.js
- npm
- Docker

## Quick Start

1. Ensure that Docker is installed on your system.

2. Ensure that port 5432 is available for Docker to use for the PostgreSQL database.

3. From the root of the project directory, run the following command to set up and start the whole development environment including frontend, backend and database:

    ```
    npm start
    ```

This command will:
- Start Docker container for the database
- Install the necessary dependencies for frontend and backend
- Run Prisma migrations
- Generate Prisma client
- Start the frontend on port 3000
- Start the backend on port 3001

## Stopping the Application

1. To stop the frontend and backend, use `CTRL+C` in the terminal where they are running.

2. To stop the Docker container, navigate to the `backend` directory and run:

    ```
    docker-compose -f docker-compose.yml down
    ```

## Troubleshooting

- If you encounter issues with Docker, ensure that Docker Desktop is running and that you have the necessary permissions to run Docker commands.

- If port 5432 is not available, you will need to either free up that port or modify the `docker-compose.yml` file in root directory to use a different port. Note that if you change the port in `docker-compose.yml`, you will also need to update the database connection configuration in your backend application to use the new port.
