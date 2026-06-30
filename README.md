# 🏋️‍♂️ AI-Powered Fitness Tracker Microservices

A modern, cloud-native, event-driven microservices application designed to track fitness activities and generate personalized, AI-driven wellness recommendations using Google's Gemini API.

---

## 🏗️ Architecture Overview

The system is built on **Spring Cloud** and **React** with a decoupled, asynchronous, event-driven communication pipeline using **RabbitMQ**.

### Key Features
*   🔐 **OAuth2 & JWT Security**: Centralized user authentication and authorization using **Keycloak**.
*   🌐 **Service Discovery & Routing**: Dynamic registration with **Netflix Eureka** and unified API routing via **Spring Cloud Gateway**.
*   ⚙️ **Centralized Configuration**: Service parameters managed externally by **Spring Cloud Config Server**.
*   ⚡ **Event-Driven AI Integration**: Activities logged by users publish event messages to **RabbitMQ**, which triggers the **AI Recommendation Service** to dynamically generate personalized insights via **Google Gemini API** asynchronously.
*   🗄️ **Polyglot Persistence**: 
    *   **PostgreSQL** for structured user profile data.
    *   **MongoDB** for highly flexible, document-based fitness activities and AI recommendations.

---

## 📊 Data Flow Diagrams (DFDs)

These diagrams describe how data enters, flows through, and is transformed by the AI Fitness Tracker ecosystem.

### Level 0: System Context Diagram
The Context Diagram defines the system boundaries, showing external entities (User, Keycloak, Gemini API) and their core interactions with the system as a single black box.

```mermaid
graph TD
    %% Styling
    classDef entity fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef system fill:#0f172a,stroke:#10b981,stroke-width:3px,color:#f8fafc,stroke-dasharray: 5 5;

    %% Nodes
    UserApp["👤 User Client App (React)"]:::entity
    KeycloakIDP["🔐 Keycloak Auth Server"]:::entity
    GeminiAPI["🤖 Google Gemini API"]:::entity
    SystemBox["⚙️ AI Fitness Tracker System"]:::system

    %% Flows
    UserApp <-->|"1. Authenticate & obtain JWT"| KeycloakIDP
    UserApp -->|"2. Submit activity logs & fetch profiles/reports"| SystemBox
    SystemBox -->|"3. Stream back activity records & AI recommendations"| UserApp
    SystemBox <-->|"4. Retrieve public verification keys (JWKs)"| KeycloakIDP
    SystemBox -->|"5. Send activity context & prompt"| GeminiAPI
    GeminiAPI -->|"6. Return structured fitness insights"| SystemBox
```

---

### Level 1: Microservices DFD (Data Flow & Process View)
This diagram decomposes the system into its core functional processes (microservices), data stores, and details the exact routing and data paths between them.

```mermaid
graph TB
    %% Styling
    classDef entity fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef process fill:#312e81,stroke:#6366f1,stroke-width:2px,color:#f8fafc;
    classDef store fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef support fill:#451a03,stroke:#d97706,stroke-dasharray: 3 3,color:#f8fafc;

    %% External Entities
    User["👤 User (Vite Frontend)"]:::entity
    Keycloak["🔐 Keycloak (OIDC/OAuth2)"]:::entity
    Gemini["🤖 Google Gemini API"]:::entity

    %% Supporting Microservices
    Eureka["📡 Eureka Discovery Server (Port 8761)"]:::support
    ConfigServer["⚙️ Config Server (Port 8888)"]:::support

    %% Subgraph for Primary System Boundary
    subgraph System Boundary
        %% Processes
        Gateway["🛡️ P1: API Gateway<br>(Port 8080)"]:::process
        UserService["👤 P2: User Service<br>(Port 8081)"]:::process
        ActivityService["🏃 P3: Activity Service<br>(Port 8082)"]:::process
        AIService["🧠 P4: AI Service<br>(Port 8083)"]:::process

        %% Datastores
        DB_User[("🗄️ D1: PostgreSQL<br>(fitness_user_db)")]:::store
        DB_Activity[("🗄️ D2: MongoDB<br>(fitnessactivity)")]:::store
        DB_Recommend[("🗄️ D3: MongoDB<br>(fitnessrecommendation)")]:::store
        MQ_Rabbit[("✉️ D4: RabbitMQ Broker<br>(activity.queue)")]:::store
    end

    %% Configuration & Discovery registration
    Gateway -.-> ConfigServer
    UserService -.-> ConfigServer
    ActivityService -.-> ConfigServer
    AIService -.-> ConfigServer

    Gateway -.-> Eureka
    UserService -.-> Eureka
    ActivityService -.-> Eureka
    AIService -.-> Eureka

    %% Primary Flows
    User -->|"1. API Call + JWT"| Gateway
    Gateway <-->|"2. Verify JWT signature (JWKs)"| Keycloak
    
    %% API Routing
    Gateway -->|"/api/users/**"| UserService
    Gateway -->|"/api/activities/**"| ActivityService
    Gateway -->|"/api/recommendations/**"| AIService

    %% User Service database interaction
    UserService <-->|"Save/Load Profile"| DB_User

    %% Activity Service flow
    ActivityService -->|"3. Validate User ID (HTTP /api/users/{id}/validate)"| UserService
    ActivityService <-->|"Save/Load Activities"| DB_Activity
    ActivityService -->|"4. Dispatch activity payload"| MQ_Rabbit

    %% AI Service Event Consumption & Recommendation flow
    MQ_Rabbit -->|"5. Consume activity message"| AIService
    AIService -->|"6. Send activity metrics & prompt"| Gemini
    Gemini -->|"7. Return insights & suggestions"| AIService
    AIService <-->|"Save/Load Recommendations"| DB_Recommend
```

---

### Level 2: Activity Log & AI Recommendation Pipeline
This detailed view trace the specific transformations, validation checks, and asynchronous communications that occur when a user logs a physical activity.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User (React Client)
    participant Gateway as 🛡️ API Gateway (8080)
    participant UserSvc as 👤 User Service (8081)
    participant ActSvc as 🏃 Activity Service (8082)
    participant Rabbit as ✉️ RabbitMQ (5672)
    participant AISvc as 🧠 AI Service (8083)
    participant Gemini as 🤖 Gemini API

    User->>Gateway: POST /api/activities (Payload + Bearer Token)
    Note over Gateway: Gateway decodes JWT &<br/>checks against Keycloak JWKs
    Gateway->>ActSvc: Route request to /api/activities
    ActSvc->>UserSvc: HTTP GET /api/users/{userId}/validate
    UserSvc-->>ActSvc: Returns User Valid (Boolean)
    
    Note over ActSvc: Build Activity Entity
    ActSvc->>ActSvc: Save to MongoDB (fitnessactivity.activities)
    
    Note over ActSvc: Publish to Exchange: fitness.exchange<br/>Routing Key: activity.tracking
    ActSvc->>Rabbit: Publish Activity Payload
    ActSvc-->>Gateway: Return HTTP 201 (Created Activity Response)
    Gateway-->>User: Show Activity logged successfully!

    Note over AISvc: Message Listener picks up payload<br/>from activity.queue
    Rabbit->>AISvc: Consume Activity Payload
    Note over AISvc: Build Prompt utilizing Activity details<br/>(Duration, type, calories, custom metrics)
    AISvc->>Gemini: POST /v1beta/models/gemini-pro:generateContent
    Gemini-->>AISvc: Return Structured Recommendation Response
    Note over AISvc: Parse response details<br/>(Improvements, Suggestions, Safety)
    AISvc->>AISvc: Save to MongoDB (fitnessrecommendation.recommendations)
```

---

## 🛠️ Technology Stack

| Service Component | Technology / Framework | Port | Database / Storage | Key Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **Config Server** | Spring Boot 3.x, Spring Cloud Config | `8888` | Local Directory (`classpath:/config`) | Config Server |
| **Eureka Server** | Spring Boot 3.x, Spring Cloud Netflix Eureka | `8761` | Memory (In-Memory registry) | Eureka Server |
| **API Gateway** | Spring Boot 3.x, Spring Cloud Gateway | `8080` | N/A | Spring Security OAuth2, Webflux |
| **User Service** | Spring Boot 3.x | `8081` | **PostgreSQL** (`fitness_user_db`) | Spring Data JPA, Hibernate, PostgreSQL Driver |
| **Activity Service** | Spring Boot 3.x | `8082` | **MongoDB** (`fitnessactivity`) | Spring Data MongoDB, RabbitMQ Starter, Webflux (WebClient) |
| **AI Service** | Spring Boot 3.x | `8083` | **MongoDB** (`fitnessrecommendation`) | Spring Data MongoDB, RabbitMQ Starter, Google Gemini Client |
| **Web Frontend** | React, Vite | `5173` | Local Storage / Session Storage | Axios, OAuth2 PKCE Client |
| **Identity Provider**| Keycloak | `8181` | Keycloak Database (default H2/Postgres) | OpenID Connect / OAuth2 |
| **Message Broker** | RabbitMQ | `5672` (AMQP)<br>`15672` (UI) | RabbitMQ Queue Store | AMQP 0-9-1 Protocol |

---

## 🚀 Local Run & Startup Sequence

To start the system locally, spin up the supporting infrastructure and services in the following order.

### Phase 1: Infrastructure (Databases & Dockerized Components)
Make sure your backing services are up and running:
1.  **PostgreSQL**: Start your local instance. Create database `fitness_user_db`.
2.  **MongoDB**: Start your local instance (port `27017`).
3.  **RabbitMQ (Hosted in Docker)**: Start the RabbitMQ container (with Management console) on ports `5672` (AMQP) and `15672` (UI dashboard):
    ```bash
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
    ```
4.  **Keycloak (Hosted in Docker)**: Run the Keycloak container on port `8181` mapped to the default keycloak port `8080`:
    ```bash
    docker run -d --name keycloak -p 8181:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:22.0.1 start-dev
    ```
    *Note: Once running, access the Keycloak admin panel at `http://localhost:8181`, log in, import/configure the realm `fitness-oauth2`, and add the client `oauth2-pkce-client`.*

### Phase 2: Core Spring Boot Services
Start the Java backend projects in this exact order:
1.  **Config Server (`configserver`)**:
    *   *Directory*: `configserver/`
    *   *Command*: `./mvnw spring-boot:run`
2.  **Eureka Server (`eureka`)**:
    *   *Directory*: `eureka/`
    *   *Command*: `./mvnw spring-boot:run`
3.  **API Gateway (`gateway`)**:
    *   *Directory*: `gateway/`
    *   *Command*: `./mvnw spring-boot:run`
4.  **User Service (`userservice`)**:
    *   *Directory*: `userservice/`
    *   *Command*: `./mvnw spring-boot:run`
5.  **Activity Service (`activityservice`)**:
    *   *Directory*: `activityservice/`
    *   *Command*: `./mvnw spring-boot:run`
6.  **AI Service (`aiservice`)**:
    *   *Directory*: `aiservice/`
    *   *Command*: `./mvnw spring-boot:run`
    *   *Environment Variables*: Ensure you have set:
        ```bash
        GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
        GEMINI_API_KEY=your_actual_gemini_api_key
        ```

### Phase 3: Frontend Web Application
1.  Navigate to the frontend directory:
    ```bash
    cd fitness-app-frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite developer server:
    ```bash
    npm run dev
    ```
4.  Access the web application at `http://localhost:5173`.

---

## 🐳 Running with Docker (Containerized Setup)

You can run the entire microservices stack and backing databases inside Docker containers. We support a **Hybrid Mode** that integrates with your existing standalone Docker containers, and an **All-in-One Mode**.

### 1. Hybrid Mode (Recommended for your current setup)
Since you already have **Keycloak** (port `8181`) and **RabbitMQ** (port `5672`/`15672`) containers running in Docker Desktop:

1.  **Start Databases**: Spin up the PostgreSQL and MongoDB containers:
    ```bash
    docker-compose up -d postgres mongodb
    ```
2.  **Start Microservices & Frontend**:
    Run the rest of the services. Make sure you set your Gemini API key in your environment first:
    *   **Windows (PowerShell)**:
        ```powershell
        $env:GEMINI_API_KEY="your_actual_api_key"
        docker-compose up --build -d config-server eureka-server user-service activity-service ai-service api-gateway fitness-app-frontend
        ```
    *   **Linux / macOS (Bash)**:
        ```bash
        export GEMINI_API_KEY="your_actual_api_key"
        docker-compose up --build -d config-server eureka-server user-service activity-service ai-service api-gateway fitness-app-frontend
        ```

Inside Docker, the microservices will connect to your host's Keycloak and RabbitMQ instances using `host.docker.internal`.

### 2. Standalone All-in-One Mode
If you prefer to manage Keycloak and RabbitMQ through this `docker-compose.yml` instead of keeping them standalone:
1.  **Stop Existing Containers**: Stop your running `nervous_vaughan` and `rabbitmq` containers.
2.  **Add Services to compose**: Uncomment or add the Keycloak and RabbitMQ services to the `docker-compose.yml`.
3.  **Run All**:
    ```bash
    docker-compose up --build -d
    ```

---

### Docker Command Reference

*   **Check container status**:
    ```bash
    docker-compose ps
    ```
*   **View live logs (e.g. for AI service)**:
    ```bash
    docker-compose logs -f ai-service
    ```
*   **Stop the stack**:
    ```bash
    docker-compose down
    ```
