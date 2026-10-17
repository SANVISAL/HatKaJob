# Comapny Service

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

### Company Service
The Company Service is a microservice designed to manage company-related data within our job management application. This service provides endpoints to create, read, update, and delete company records, as well as to handle company-specific operations,like post job .

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
- You have installed [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- You have installed [npm](https://www.npmjs.com/get-npm) (Node Package Manager) or [yarn](https://yarnpkg.com/)
- You have terminal or command prompt access

### Installation
1. **Clone the Repository**
    ```sh
    git clone https://github.com/neakhatka/neakhatka.git
    ```
2. **Navigate to the Service Directory**
    ```sh
    cd packages/company-service
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
        PORT=4004
        API_GATEWAY=http://localhost:4001
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
To use the Company Service, you will typically make HTTP requests to it. Here are some common examples:
### Company Service

1. **GET Request Example**
    ```sh
    curl -X GET http://localhost:4004/v1/company
    ```

2. **POST Request Example**
    ```sh
    curl -X GET http://localhost4004/v1/company
    -H "Content-Type: application/json" \
    -d '{
    "companyName": "Example Company",
    "logo": "http://example.com/logo.png",
    "contactPhone": 1234567890,
    "contactEmail": "contact@example.com",
    "websiteLink": "http://example.com",
    "location": "123 Example St.",
    "contactPerson": "John Doe",
    "numberOfEmployees": 50,
    "address": "123 Example St.",
    "companyDescription": "A sample company",
    "userId": "user123"
    }'
    ```
### Post Service
1. **GET Request Example**
    ```sh
    curl -X GET http://localhost:4004/v1/company/posting
    ```

2. **POST Request Example**
    ```sh
    curl -X GET http://localhost4004/v1/company/posting
    -H "Content-Type: application/json" \
    -d '
    {
    "title": "example",
    "description": "your description",
    "requirements": ["Bachelor"],
    "responsibilities": "your",
    "people": 3,
    "location": "New York, NY",
    "duration": 12,
    "gender": "other",
    "type": "full-time",
    "available_position": 2,
   "language": "English",
  "deadline": "2024-12-31T23:59:59.000Z",
  "salaries": 50000 
    ```
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