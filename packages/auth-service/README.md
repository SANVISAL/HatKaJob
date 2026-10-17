# Auth Gateway

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

Auth-Service

### Description

short for Authentication Service. responsible for handling user authentication and authorization. Its primary function is to verify the identity of users and grant them access to resources or functionalities based on their permissions.

### Built With

- [![Static Badge](https://img.shields.io/badge/Docker%20Desktop-1D63ED?style=for-the-badge&logo=docker&logoColor=fff)](https://www.docker.com/products/docker-desktop/)
- [![Static Badge](https://img.shields.io/badge/Node.js-499442?style=for-the-badge&logo=node.js&logoColor=fff&color=499442)](https://nodejs.org/en)
- [![Static Badge](https://img.shields.io/badge/Tyscript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff&color=3178C6)](https://www.typescriptlang.org/)
- [![Static Badge](https://img.shields.io/badge/Express.js-000?style=for-the-badge&logo=express&logoColor=fff&color=000)](https://expressjs.com/)
- [![Static Badge](https://img.shields.io/badge/Mongodb-%23023430?style=for-the-badge&logo=mongodb&logoColor=fff&color=%23023430)](https://www.mongodb.com/)

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
   cd auth-service
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
     PORT=xxxx
     CLIENT_URL= xxxxx
     API_GATEWAY= xxxxx
     JWT_EXPIRES_IN=xxxx
     CLIENT_ID =xxxxxxxxxxxxxxxxxxxxxxx
     CLIENT_SECRET = xxxxxxxxxxxxx
     REDIRECT_URI = xxxxxxxxxxxxxxxxx

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

1. **POST Request Example**
   ```sh
   curl -X POST http://localhost:4001/v1/auth/signup
   -H "Content-Type: application/json" \
   -d '
   {
        "username": "username",
        "email": "example@gmail.com",
        "password": "password123",
        "role": "employer"
        }'
   ```

### Endpoints

List the main endpoints provided by your Auth-Service. For example:

1. **User Service Endpoint**

   - **Description:** Handles user-related requests.
   - **URL:** `/v1/users`
   - **Methods:**
     - `GET /v1/users`: Retrieves a list of users.
     - `POST /v1/users`: Creates a new user.

2. **Company Service Endpoint**
   - **Description:** Handles company related requests.
   - **URL:** ` /v1/company`
   - **Methods:**
     - `POST /v1/company`: Authenticates a user.
     - `POST  /v1/company`: Registers a new user.

## Contact

If you have any questions, issues, or suggestions, please feel free to reach out to us. Here are some ways you can contact the maintainers of this project:

### Email

- _Support Email:_ [sanvisal2302@gmail.com](mailto:sanvisal2302@gmail.com)
- _Maintainer Email:_ [neakhatka@gmail.com](mailto:neakhatka@gmail.com)

### Social Media

- Follow us on Facebook: [Neakhatka](https://web.facebook.com/profile.php?id=61550779933720&_rdc=1&_rdr)
- Follow us on X: [Neakhatka](https://x.com/neakhatka?mx=2)

### Troubleshooting

If you encounter any issues, check the following:

- Ensure Node.js and npm/yarn are installed and up to date.
- Verify the environment variables in the `.env` file are correctly set.
