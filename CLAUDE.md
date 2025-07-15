# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wild Transfer is a file sharing platform built with a microservices architecture:
- **Frontend**: React 19 + TypeScript + Vite with Tailwind CSS and shadcn/ui
- **Backend**: Node.js GraphQL API with TypeORM + PostgreSQL
- **Storage API**: Express.js file upload service with Multer
- **Database**: PostgreSQL with Adminer for management

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm run dev         # Start development server (port 5173)
npm run build       # Build for production
npm run lint        # ESLint
npm test            # Run Vitest tests
npm run test:run    # Run tests once
```

### Backend (GraphQL API)
```bash
cd backend
npm run start:dev   # Start with seeding (development)
npm run start:prod  # Start without seeding (production)
npm run build       # TypeScript compilation
npm run lint        # ESLint
npm test            # Jest tests
npm run seed        # Run database seeds
npm run create-admin # Create admin user
npm run email       # Start email dev server
```

### Storage API (File Service)
```bash
cd storage-api
npm run dev         # Start development server (port 3000)
npm run build       # TypeScript compilation
npm run start       # Start production server
```

### Docker Development
```bash
# Full stack with Docker
docker-compose up --build

# Access points:
# - Application: http://localhost:7007
# - Adminer: http://localhost:8080
# - Default admin: admin@example.com / Admin@123456
```

## Architecture Details

### GraphQL Schema & Resolvers
The backend uses TypeGraphQL with these main entities:
- User (with role-based auth: USER/ADMIN)
- Resource (file metadata)
- Contact (user relationships)
- Comment, Like, Report (social features)
- Subscription (premium features)
- SystemLog (audit trail)

### Authentication
- JWT tokens stored in HTTP-only cookies
- Role-based authorization (USER/ADMIN)
- Protected routes with `AdminRoute` component
- Context-based auth state management

### File Upload Flow
1. Frontend uploads to Storage API (port 3000)
2. Storage API saves files to `/uploads` directory
3. Backend stores file metadata in PostgreSQL
4. Nginx serves static files in production

### Database Configuration
- PostgreSQL with TypeORM
- Migrations and entities in `backend/src/entities/`
- Seeding with Faker.js data
- Admin user auto-creation in Docker

### Key Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Apollo Client
- **Backend**: Node.js, TypeScript, TypeGraphQL, TypeORM, Apollo Server
- **Storage**: Express.js, Multer, JWT auth middleware
- **Database**: PostgreSQL
- **Testing**: Vitest (frontend), Jest (backend)
- **Internationalization**: i18next with French/English support

### Environment Setup
Backend requires `.env` file with:
```
JWT_SECRET_KEY=<your-secret>
RESEND_API_KEY=<resend-api-key>
RESEND_EMAIL_DOMAIN=wildtransfer.cloud
```

### Code Generation
Frontend uses GraphQL Code Generator:
```bash
cd frontend
npm run start  # Runs codegen then vite
```

### Testing Strategy
- Frontend: Vitest with React Testing Library
- Backend: Jest for unit tests
- Test commands available in each service's package.json