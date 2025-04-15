# MagicHabit System Patterns

## System Architecture

MagicHabit follows a modular monorepo architecture with clear separation between frontend, backend, and shared utilities. The system is designed for maintainability, testability, and scalability.

```
mazic-habit/
├── packages/
│   ├── mazic/                   - Frontend web application (React, Next.js)
│   ├── mazic-server/            - Backend API (Golang, Pocketbase)
│   ├── mazic-mobile/            - Mobile application (React Native)
│   ├── mazic-ui/                - Shared UI components
│   ├── mazic-shared/            - Shared utilities
│   ├── mazic-prisma/            - Database schema definitions
│   └── mazic-docker/            - Docker configurations
```

## Key Technical Decisions

### 1. Backend Architecture
- **Language**: Golang for performance and concurrency
- **Framework**: Pocketbase for built-in authentication, database, and API features
- **Database**: SQLite for simplicity and embedded storage
- **Authentication**: JWT-based with role-based access control
- **API Design**: RESTful API with consistent controller-service-schema pattern

### 2. Frontend Architecture
- **Framework**: React with Next.js for web, React Native for mobile
- **State Management**: Combination of React Query for server state and Zustand for client state
- **UI Components**: shadcn/ui for web, React Native Paper for mobile
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS for web, native styling for mobile

### 3. Module Organization
Each logical feature is organized as a self-contained module with consistent structure:

#### Backend Modules
```
module/
├── module.controller.go    - HTTP request handling
├── module.service.go       - Business logic
├── module.schema.go        - Data models and validation
└── module.route.go         - Route definitions
```

#### Frontend Modules
```
module/
├── components/             - React components for the module
├── hooks/                  - Custom hooks for API integration and state
├── pages/                  - Page components (list, create, update)
├── schemas/                - Zod validation schemas
└── services/               - API service functions
```

## Design Patterns

### 1. Repository Pattern
- Backend services use a repository pattern via Pocketbase's dbx for database operations
- Clean separation between data access and business logic

### 2. Dependency Injection
- Services are injected into controllers
- Controllers are injected into routes
- Promotes testability and loose coupling

### 3. Component Composition
- Frontend uses composition over inheritance
- Reusable components with clear props interfaces
- Higher-order components for common behaviors

### 4. Custom Hook Pattern
- Encapsulates complex logic in reusable hooks
- Separates UI concerns from data fetching
- Examples: `useHabitApis`, `useCheckInColumns`

### 5. Provider Pattern
- Context providers for theme, authentication, and global state
- Reduces prop drilling and centralizes state management

### 6. Docker Build Pattern
- Multi-stage build process for optimized container images
- Builder stage compiles Go application and prepares web assets
- Final stage includes only necessary runtime files
- Critical files like email templates are explicitly copied from builder to final stage

## Data Flow

### 1. API Request Flow
1. Client sends request to specific endpoint
2. Route directs to appropriate controller method
3. Controller validates input
4. Service executes business logic
5. Repository performs database operations
6. Response flows back through the same layers

### 2. Frontend Data Flow
1. Components use custom hooks for data needs
2. Hooks call API services
3. React Query manages caching and refetching
4. UI updates reactively based on query state
5. Forms use React Hook Form + Zod for validation

## Security Patterns

1. **Authentication Middleware**: JWT validation on protected routes
2. **Permission Checks**: Role-based access on specific operations
3. **Input Validation**: Both frontend (Zod) and backend (ozzo-validation)
4. **API Key Security**: For widget embedding authentication
5. **Data Privacy**: User-controlled visibility settings

## Error Handling

1. **Backend**: Standardized error responses with appropriate HTTP status codes
2. **Frontend**: React Query error states with user-friendly messages
3. **Validation**: Comprehensive error messaging for form validation
4. **Logging**: Structured logging for backend errors

## Testing Strategy

1. **Unit Tests**: For service and utility functions
2. **Integration Tests**: For API endpoints
3. **E2E Tests**: For critical user journeys
4. **Component Tests**: For UI components 
