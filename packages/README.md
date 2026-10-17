# All Service

### Table of Contents
1. [About the Service](#about-the-service)
    - [Services Structure](#services-structure)
2. [Services Responsibilities](#services-responsibilities)
3. [Contact](#contact)


### All Service
This project is a job management application built using a microservices architecture. The application consists of several services, each responsible for a specific domain of the application. The services include:
- API Gateway
- Auth Service
- Company Service
- Notification Service
- Profile Service


### Services Stucture

```
NEAKHATKA
├── node_modules
├── packages
│   ├── api-gateway
│   ├── auth-service
│   ├── company-service
│   ├── notification
│   ├── profile-service
│   └── volumes
├── .gitignore
├── docker-compose.yaml
├── package.json
├── README.md
└── yarn.lock

```

### Service Responsibilities
- API Gateway: The API Gateway functions as global middleware, checking all requests that users make to each service in a microservice architecture. It serves as the first line of security, validating user requests.
- Auth Service: Responsible for handling user authentication and authorization. Its primary function is to verify the identity of users and grant them access to resources or functionalities based on their permissions.
- Company Service: The Company Service is a microservice designed to manage company-related data within our job management application. This service provides endpoints to create, read, update, and delete company records, as well as to handle company-specific operations,like post job.
- Notification Service: The Notification Service is a microservice designed to manage notifications within our job management application
- Profile Service: The Profile Service is a microservice designed to manage user profiles within our job management application. This service provides endpoints to create, read, update, and delete user profiles, as well as to handle profile-specific operations.

## Contact

If you have any questions, issues, or suggestions, please feel free to reach out to us. Here are some ways you can contact the maintainers of this project:

### Email
- *Support Email:* [neakhatka@gmail.com](mailto:neakhatka@gmail.com)
- *Maintainer Email :*  svatmanith76@gmail.com - sanvisal2302@gmail.com - rathna.chh@gmail.com

### Social Media
- Follow us on Facebook: [Neakhatka](https://web.facebook.com/profile.php?id=61550779933720&_rdc=1&_rdr)
- Follow us on X: [Neakhatka](https://x.com/neakhatka?mx=2)