---
icon: pen-to-square
date: 2025-06-25
category:
  - Learning Records
tag:
  - JD
---

# Internship note
## CI Tools

### 1. **JaCoCo** (Java Code Coverage)

 **Purpose:** *Code coverage analysis tool*

* Measures how much of your source code is exercised by your unit tests
* Tracks:

  * Line coverage
  * Branch coverage
  * Method/class coverage
* Generates visual HTML reports showing what parts of code are untested

**Typical Use Cases:**

* Works with JUnit and Mockito
* Integrated into CI pipelines (Jenkins, GitHub Actions, etc.)

**Example (Maven):**

```bash
mvn clean test jacoco:report
```

**Report Path (Maven):** `target/site/jacoco/index.html`



### 2. **PMD** (Programming Mistake Detector)

**Purpose:** *Static code analysis*

* Scans your Java code for potential issues like:

  * Poor naming conventions
  * Dead code
  * Empty catch blocks
  * Duplicate or overly complex code
* Helps enforce coding standards and best practices
* Can be customized with your own rule sets

 **Similar tools:** Checkstyle, SpotBugs

 **Example (Maven):**

```bash
mvn pmd:pmd
```

 **Report Path:** `target/site/pmd.html`



### 3. **Mockito**

 **Purpose:** *Mocking framework for unit testing*

* Used to simulate dependencies during tests
* Lets you mock methods, define return values, and verify interactions
* Prevents your tests from calling real external systems (DBs, APIs, etc.)

 **Example:**

```java
MyService mockService = Mockito.mock(MyService.class);
when(mockService.fetchData()).thenReturn("Mock Result");

assertEquals("Mock Result", mockService.fetchData());
verify(mockService).fetchData();
```

 Often used with **JUnit**


### 🔄 Summary Comparison

| Tool        | What it does                     | Typical Use                    |
| ----------- | -------------------------------- | ------------------------------ |
| **JaCoCo**  | Measures test coverage           | After unit testing             |
| **PMD**     | Static analysis for code quality | During development/code review |
| **Mockito** | Mocks dependencies in tests      | Inside unit tests              |
