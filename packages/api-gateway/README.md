# API Gateway

## Table of Contents
1. [About the Service](#about-the-service)
    - [Built With](#built-with)
    - [Service Structure](#service-structure)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
3. [Usage](#usage)
4. [Contact](#contact)

## About the Service

### Service Name
API Gateway

### Description
The API Gateway functions as global middleware, checking all requests that users make to each service in a microservice architecture. It serves as the first line of security, validating user requests.

### Built With
* [![Static Badge](https://img.shields.io/badge/Docker%20Desktop-1D63ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/products/docker-desktop/)
* [![Static Badge](https://img.shields.io/badge/Node.js-499442?style=for-the-badge&logo=node.js&logoColor=fff&color=499442)](https://nodejs.org/en)
* [![Static Badge](https://img.shields.io/badge/Tyscript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff&color=3178C6)](https://www.typescriptlang.org/)
* [![Static Badge](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=fff&color=000)](https://expressjs.com/)
* [![Static Badge](https://img.shields.io/badge/Mongodb-%23023430?style=for-the-badge&logo=mongodb&logoColor=fff&color=%23023430)](https://www.mongodb.com/)
## Getting Started

### Prerequisites
Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/)
- You have installed [npm](https://www.npmjs.com/get-npm) (Node Package Manager) or [yarn](https://yarnpkg.com/)
- You have terminal or command prompt access

### Installation
1. **Clone the Repository**
    ```sh
    git clone https://github.com/neakhatka/neakhatka.git
    ```
2. **Navigate to the Service Directory**
    ```sh
    cd api-gateway
    ```
3. **Install Dependencies**
    ```sh
    npm install
    ```
    or
    ```sh
    yarn
    ```

### Configuration
1. **Create a `.env` File**
    - Create a `.env` file in the root of the project.
    - Add necessary environment variables. For example:
        ```plaintext
        PORT=3000
        AUTH_SERVICE_URL=http://auth-service-url
        USER_SERVICE_URL=http://user-service-url
        ```

### Running the Service
1. **Start the Server**
    ```sh
    yarn start:dev
    ```
2. **Run Tests**
    ```sh
    yarn test
    ```
## Usage

### Making Requests
To use the API Gateway, you will typically make HTTP requests to it. Here are some common examples:

1. **GET Request Example**
    ```sh
    curl -X GET http://localhost:3000/path/to/your/service
    ```

2. **POST Request Example**
    ```sh
    curl -X POST http://localhost:3000/path/to/your/service \
    -H "Content-Type: application/json" \
    -d '{"key1":"value1", "key2":"value2"}'
    ```

### Endpoints
List the main endpoints provided by your API Gateway. For example:

1. **User Service Endpoint**
    - **Description:** Handles user-related requests.
    - **URL:** `/user-service`
    - **Methods:**
        - `GET /user-service/users`: Retrieves a list of users.
        - `POST /user-service/users`: Creates a new user.

2. **Auth Service Endpoint**
    - **Description:** Handles authentication-related requests.
    - **URL:** `/auth-service`
    - **Methods:**
        - `POST /auth-service/login`: Authenticates a user.
        - `POST /auth-service/register`: Registers a new user.

## Contact

If you have any questions, issues, or suggestions, please feel free to reach out to us. Here are some ways you can contact the maintainers of this project:

### Email
- *Support Email:* [sanvisal2302@gmail.com](mailto:sanvisal2302@gmail.com)
- *Maintainer Email:* [neakhatka@gmail.com](mailto:neakhatka@gmail.com)

### Social Media

- Follow us on Facebook: [Neakhatka](https://web.facebook.com/profile.php?id=61550779933720&_rdc=1&_rdr)
- Follow us on X: [Neakhatka](https://x.com/neakhatka?mx=2)

### Troubleshooting
If you encounter any issues, check the following:
- Ensure Node.js and npm/yarn are installed and up to date.
- Verify the environment variables in the `.env` file are correctly set.