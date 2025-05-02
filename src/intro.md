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

# Richard Chen

- Email: [ruocchen1220@gmail.com](mailto:ruocchen1220@gmail.com)
- Phone: +61 0478396285
- Location: Melbourne, 3000
---

## EDUCATION

**Master of Information Technology, Specializing in Computing**  
*The University of Melbourne*  
_Feb 2024 - Dec 2025_  
*Relevant Courses*: Programming and Software Development, Internet Technology, Algorithms and Complexity, Database Systems and Information Modelling, Distributed Systems, Software Process and Management, Machine Learning, Cluster and Cloud Computing, Declarative Programming, Information Visualization, Mobile Computing Systems Programming

**Bachelor of Arts, Major in Psychology, Minor in Economy**  
*The University of Melbourne*  
_Aug 2020 - Dec 2023_  
*Relevant Courses*: Research Methods of Human Inquires

---

## TECHNICAL SKILLS
- **Programming Languages**: **Java**, Python, C#, JavaScript, TypeScript, SQL, Shell, Lua, R
- **Frameworks**: **Spring Boot**, Spring Cloud, Django, MyBatis, Node.js, Express.js, Next.js, Vue.js, WordPress
- **Middleware**: Redis, Elasticsearch, RabbitMQ, Kafka, NGINX
- **Databases**: MySQL, PostgreSQL, MongoDB
- **Development Tools**: Git, Docker, Kubernetes, Linux, Postman, Maven, JMeter, Swagger, Selenium
- **Certifications**: AWS Cloud Practitioner
---

## INTERNSHIPS

### Full Stack Development Intern
*China Merchants Bank, Hangzhou, Zhejiang*  
_Nov 2024 - Feb 2025_<br>
_Nov 2023 - Feb 2024_  
- Implemented and optimized Excel data import and export functionality in a Spring Boot and Vue.js environment, creating tailored RESTful APIs for advanced data manipulation, led to a 50% increase in data management efficiency and productivity
- Mastered and deployed Selenium and Scrapy for automated data scraping, achieving daily targets from multiple sources, enhancing data accuracy by 25%, and ensuring seamless project continuity
- Developed and optimized an Auto-Complete interface for system configuration by using Spring Boot and MyBatis, cutting maintenance costs by 50% and reducing runtime by 1.5 minute 
- Encapsulated a notification API with Spring Boot and MyBatis for internal emails, app messages, and SMS. Features like queue management and custom configurations improved colleague productivity by 40%
- Implemented an automated document security check API with Spring Boot and XCode, an internal low code platform, reducing manual checks and cutting security check times by 75%
- Learned and Applied prompt engineering to create a document generation robot on internal AI market that automates the creation of detailed design documents, increasing documentation efficiency by 60%
- Gained hands-on experience with internal cloud native management platforms and CI/CD pipelines, participating in the deployment of various interface projects, ensuring smooth integration and delivery

### Junior IT All Rounder  
*AAkonsult PTY LTD, Melbourne, Victoria*  
_Jul 2024 - Nov 2024_  
- Developed a portal to boost appearance and functionality of Payment Forms deploying Salesforce Experience Cloud Platform by using CSS3.
- Self-training and receiving mentoring to become proficient in Salesforce. Solving day-to-day cases and contributing to the Knowledgebase and App content
- Enhanced user experience and increased visual appeal by 30% across multiple online platforms by using Figma and Statamic, resulting in a 20% increase in user engagement
- Developed a user-friendly web application using JavaScript that automates calculations for user inputs and exports results, achieving a 50% improvement in calculation efficiency
- Conducted batch analysis of user inputs using Python, leading to significant enhancements in the existing knowledge base and resulting in a 70% increase in efficiency

---

## PROJECT EXPERIENCES

### Crypto Currency Trading System
*Mar 2025 - Still ongoing*  
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
