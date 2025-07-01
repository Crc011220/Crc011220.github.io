---
icon: circle-info
cover: /assets/images/unimelb-feit-logo.png
date: 2024-11-01
category:
  - Genesis
tag:
  - Resume
star: true
sticky: true
---

# About Me

# Ruochen Chen

- Email: [ruocchen1220@gmail.com](mailto:ruocchen1220@gmail.com)
- Phone: +61 0478396285
- Location: Melbourne, 3000
---

## EDUCATION

**Master of Information Technology, Specializing in Computing**  
*The University of Melbourne*  
_Feb 2024 - Dec 2025_  
*Relevant Courses*: Programming and Software Development, Internet Technology, Algorithms and Complexity, Database Systems and Information Modelling, Distributed Systems, Software Process and Management, Machine Learning, Cluster and Cloud Computing, Declarative Programming, Information Visualization

**Bachelor of Arts, Major in Psychology, Minor in Economy**  
*The University of Melbourne*  
_Aug 2020 - Dec 2023_  
*Relevant Courses*: Research Methods of Human Inquires

---

## TECHNICAL SKILLS
- **Programming Languages**: **Java**, Python, C#, JavaScript, TypeScript, SQL, Shell, Lua, R, Haskell, Prolog
- **Frameworks**: **Spring Boot**, Spring Cloud, Django, MyBatis, Node.js, Express.js, Next.js, Vue.js, WordPress
- **Databases**: MySQL, PostgreSQL, Redis, Elasticsearch, MongoDB
- **Message Queue**: RabbitMQ, Kafka
- **Development Tools**: Git, Docker, Kubernetes, Linux, Postman, Maven, JMeter, Swagger, Selenium
- **Certifications**: AWS Cloud Practitioner
---

## INTERNSHIPS

### Full Stack Development Intern
*JD.com*  
_May 2025 - July 2025_
- **Scheduled Task Dispatch System** (Spring Boot + Spring Security + MyBatis Plus + Redis + React)
  - Developed an enterprise-level distributed scheduling platform for timed tasks using Spring Boot, Spring Security, MyBatis Plus, Redis, and React. Built the core scheduling engine with Spring Boot and XXL-JOB, supporting Cron expression configuration and task failover.
  - Designed a multi-layer fault-tolerant architecture, achieving zero single-point failures through application clustering, master-slave database setup, and distributed task scheduling, ensuring 99.9% system availability with automatic failover and uninterrupted service.
  - Designed and implemented a comprehensive RBAC (Role-Based Access Control) system, utilizing Spring Security and JWT for fine-grained access control, ensuring system security and compliance with user operations.
  - Developed a React and TypeScript-based front-end monitoring dashboard, integrating real-time task status display, execution log queries, and performance statistics charts, enhancing operational monitoring efficiency and user experience.
  - Established an automated quality assurance process, integrating Git Hooks for pre-commit validation and GitHub Actions for continuous integration, ensuring code quality and system stability with JUnit 5 unit testing framework.

### Full Stack Development Intern
*China Merchants Bank*  
_November 2024 - February 2025_
_November 2023 - February 2024_
- **Internal Lean Management Platform** (Spring Boot + Vue.js + Redis + Kafka + ECS)
  - Led the development of a general-purpose Excel data processing framework using Spring Boot, Vue.js, Redis, Kafka, and ECS, supporting data parsing and reading/writing for any structured headers, adapting to various business data formats. Achieved stable performance for importing and exporting data at a scale of 100,000 entries through asynchronous batch processing, data sharding, and cache optimization, providing foundational support for multiple business modules.
  - Designed and implemented an automated generation and validation process for software development artifacts (e.g., test reports, design documents). Built an intelligent review bot using Prompt Engineering and domain knowledge bases, supporting automatic document modification suggestions, reducing manual review by approximately 75%, and effectively enhancing the standardization and delivery efficiency of development documentation.
- **Business Marketing Promotion Management System** (Spring Boot + Nacos + Selenium + Scrapy)
  - Led the construction of a unified notification microservice system, encapsulating components for email, application messages, and SMS sending. Utilized Nacos for configuration management and service registration, supporting flexible invocation and dynamic expansion, enhancing the uniformity and maintainability of inter-system message notifications.
  - Participated in the development of the opportunity mining module, implementing multi-site automated data collection using Selenium and Scrapy, supporting rule configuration and content filtering, improving the coverage and quality of marketing data.
- **Cloud-Native Management Platform and CI/CD Pipeline Practice**
  - Led the deployment and integration of multiple Spring Boot interface projects, practicing cloud-native service governance, ensuring the stability of the system launch process and continuous delivery capability.

### Junior IT Generalist
*AAkonsult PTY LTD*  
_July 2024 - November 2024_
- **Payment Form Portal Website Development** (Salesforce Experience Cloud + Apex + Python + React + Figma)
  - Developed a payment form portal website using Salesforce Experience Cloud, Apex, Python, React, and Figma, optimizing the interactive interface and functional modules to enhance user operation fluency.
  - Learned and utilized Apex to develop backend business logic (e.g., data query interfaces, status update functions), improving code quality through debugging and code review, familiarizing with Salesforce platform workflows.
  - Developed an automated calculation tool using React, enabling real-time validation of user input and one-click export of results, improving data processing efficiency.
  - Built batch analysis scripts for user input using Python, optimizing the data cleaning and classification process of the knowledge base, enhancing analysis efficiency.
  - Designed high-fidelity prototypes using Figma, combined with Statamic for multi-platform dynamic content management, enhancing visual appeal and increasing average user dwell time.

---

## PROJECT EXPERIENCES

### Crypto Currency Trading System
*Mar 2025 - May 2025*  
*Technologies*: Spring Boot, Spring Cloud, Spring Security, MyBatis-Plus, Redis, JWT, AWS, Docker, RocketMQ, Disruptor
- Designed a microservices architecture with Spring Cloud, including services like GatewayService, AuthorizationService, MemberService, AdminService, FinanceService, and ExchangeService. Leveraged Nacos for service discovery and configuration management, OpenFeign for remote procedure calls, and LoadBalancer for server-side load balancing
- Implemented a unified authentication and authorization mechanism using Spring Security OAuth2.0 and JWT, with secure RESTful API communication supported by OpenFeign for inter-service calls
- Utilized Redis to cache hotspot data such as access tokens and verification codes, significantly improving system responsiveness and throughput
- Deployed the system on AWS EC2 instances, with AWS S3 for static asset storage and AWS SNS for SMS delivery, ensuring scalability and high availability
- Integrated third-party services including GeeTest for CAPTCHA validation and Alibaba Cloud Identity Verification to enhance platform security
- Adopted the Snowflake algorithm to generate globally unique IDs and employed JetCache to implement high-performance distributed locking, ensuring data consistency and preventing overselling in high-concurrency scenarios such as flash sales
- Built a high-throughput, low-latency, and lock-free matching system using RocketMQ and Disruptor, enabling seamless message ingestion → RingBuffer dispatch → asynchronous processing by the match engine
- Integrated WebSocket communication using Tio + RocketMQ, allowing backend services to push real-time market data to clients efficiently
- Implemented a scheduled push mechanism using Spring Boot tasks for event subscriptions, and utilized Redis List to efficiently store and manage candlestick data

### Lightweight Remote Procedure Call Framework
*Jan 2025 - Mar 2025*  
*Technologies*: Java, Netty, Zookeeper, Redis
- Developed an RPC framework utilizing dynamic proxies to enable transparent service invocation, simplifying interactions between clients and servers
- Enhanced network communication efficiency by replacing traditional blocking I/O with Netty's non-blocking I/O (NIO) capabilities
- Designed a custom RPC protocol supporting multiple serialization strategies (e.g. Java IO, JSON) to increase data transmission flexibility and efficiency
- Integrated with Zookeeper for service discovery and automatic registration, ensuring high system availability
- Implemented multiple load balancing algorithms (e.g. Random, Round-Robin) to distribute traffic across service providers, enhancing system throughput
- Introduced Redis caching to reduce the load on Zookeeper, further improving system performance

### E-commerce Platform  
*Aug 2024 - Nov 2024*  
*Technologies*: Spring Boot, Spring Cloud, MyBatis-Plus, NGINX, RabbitMQ, Redis, Elasticsearch  
- Led development of a comprehensive e-commerce platform using Spring Boot, enhancing customer experience by integrating advanced functionalities for dynamic product display and secure transactions
- Optimized database operations with MyBatis-Plus, supporting high-volume transactions efficiently
- Designed and implemented a robust microservices architecture with NGINX and Spring Cloud Gateway, improving system scalability and reliability through effective traffic management and intelligent service routing
- Utilized Spring Cloud for seamless service integration and management
- Enhanced system responsiveness through implementation of asynchronous messaging with RabbitMQ for key operations such as product updates, reducing processing time by 50%
- Boosted search efficiency by integrating Elasticsearch, resulting in a 60% faster data retrieval rate
- Implemented JWT encryption for securing newly created user information and utilized Redis for persistent storage of user data
- Managed and optimized over 500MB of static files across multiple projects using Alibaba Cloud OSS (Object Storage Service), resulting in a reduction in load times and a decrease in storage costs

### Vending Machine Management System  
*Mar 2024 – May 2024*  
*Technologies*: Spring Boot, Vue, Element-Plus, MyBatis, Redis  
- Integrated Amazon S3 for efficient storage and management of static assets, enabling scalable and secure handling of project resources
- Optimized database operations with MyBatis, supporting high-volume transactions efficiently
- Implemented Redis caching for token to improve performance and reduce database load, ensuring faster and more efficient user verification
- Utilized Spring Security framework for secure authentication, ensuring that data access is restricted to authorized roles only, thereby enhancing application security and data integrity
- Using the Velocity template engine to generate basic CRUD code, which improved development efficiency by 50%
- Containerized the project using DockerFile and Kubernetes and deployed on a virtual machine, enabling successful local access through Docker networking and port mapping
---

## OTHER SKILLS AND INTERESTS

- **Languages**: English, Mandarin
- **Office Software**: Microsoft Word, Microsoft Excel, Microsoft PowerPoint, Microsoft Outlook
- **Tools**: AWS, SalesForce, Figma, Xmind, Draw.io, Trello
- **Interests**: Fitness, Chess, Saxophone, Basketball, Calligraphy

---
