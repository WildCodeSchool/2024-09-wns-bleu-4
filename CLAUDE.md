# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wild Transfer is a file sharing application built with a microservices architecture. The project consists of four main services:

- **Frontend**: React/TypeScript app with Vite, Tailwind CSS, and shadcn/ui components
- **Backend**: Node.js/TypeScript GraphQL API with Apollo Server, TypeORM, and PostgreSQL
- **Storage-API**: Express.js file storage service with multer for file uploads
- **Playwright**: End-to-end testing suite

## Development Commands

### Frontend (React/TypeScript)
```bash
cd frontend
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run Vitest unit tests
npm run test:run     # Run tests once without watch mode
```

### Backend (GraphQL API)
```bash
cd backend
npm run start:dev    # Run with seeding + development server (port 4000)
npm run start:prod   # Run with seeding + production server
npm run build        # Compile TypeScript
npm run seed         # Seed database with test data
npm run create-admin # Create admin user
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run email        # Start email development interface
```

### Storage API (File Service)
```bash
cd storage-api
npm run dev          # Development server (port 3000)
npm run start        # Production server
npm run build        # Compile TypeScript
```

### E2E Testing (Playwright)
```bash
cd playwright
npm test             # Run all Playwright tests
npm run test:ui      # Run with Playwright UI
npm run test:chromium # Run Chromium-specific tests
npm run test:firefox  # Run Firefox-specific tests
npm run test:webkit   # Run WebKit-specific tests
```

### Docker Setup
```bash
# Full stack with Docker (port 7007)
docker-compose up --build

# Production build
docker-compose -f docker-compose.prod.yml up --build
```

## Architecture & Tech Stack

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with Hot Module Replacement
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Apollo Client cache + React Context (AuthContext)
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next with language detection
- **Payment**: Stripe integration with React Stripe.js
- **Testing**: Vitest with React Testing Library

### Backend Architecture
- **Framework**: Apollo Server with Express
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with cookie-based sessions
- **Payment**: Stripe webhooks and subscriptions
- **Email**: Resend API with React Email templates
- **File Storage**: Integration with separate storage service
- **Rate Limiting**: Express rate limiter middleware
- **Testing**: Jest

### Key Backend Entities
- **User**: Authentication, roles (admin/user), Stripe customer ID
- **Resource**: File metadata and sharing permissions
- **Subscription**: Premium subscriptions with Stripe integration
- **Comment/Like/Report**: Social features for resources
- **Contact**: User relationship management
- **SystemLog**: Admin activity tracking

### Storage API Architecture
- **Framework**: Express.js with TypeScript
- **File Upload**: Multer with configurable storage
- **Authentication**: JWT verification middleware
- **Cleanup Service**: Automated removal of expired temporary files
- **File Types**: Permanent user files + temporary shared links

## Environment Configuration

### Required Environment Variables

**Backend (.env):**
```bash
JWT_SECRET_KEY=your_jwt_secret_here
RESEND_API_KEY=your_resend_key_here
RESEND_EMAIL_DOMAIN=wildtransfer.cloud
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Frontend (.env):**
```bash
VITE_ENVIRONMENT=DEV|STAGING|PROD
```

The frontend automatically configures API endpoints based on VITE_ENVIRONMENT:
- DEV: http://localhost:7007/api
- STAGING: https://staging.wildtransfer.cloud/api
- PROD: https://wildtransfer.cloud/api

## Database & Seeding

The backend automatically synchronizes database schemas on startup. For development:

- Default admin user: admin@example.com / Admin@123456
- Premium test user: premium@example.com / Premium@123456
- Database runs on PostgreSQL (Docker port 5432)
- Adminer available at port 8080 for database management

## GraphQL API

The backend exposes a GraphQL endpoint at `/` (port 4000) with the following resolvers:
- UserResolver: Authentication, profile management
- ResourceResolver: File operations and sharing
- PaymentResolver: Stripe integration
- SubscriptionResolver: Premium subscription management
- ContactResolver: User relationships
- CommentResolver/LikeResolver/ReportResolver: Social features
- SystemLogResolver: Admin activity tracking

## Payment Integration

Stripe is fully integrated for premium subscriptions:
- Payment intents for one-time payments
- Subscription management with webhooks
- Automatic user upgrade/downgrade
- Test cards available for development
- Webhook endpoint: `/webhooks/stripe`

## File Storage System

Files are managed through the storage-api service:
- **Permanent Files**: User uploads with authentication required
- **Temporary Links**: Time-limited public access for sharing
- **Cleanup Service**: Automatic deletion of expired files
- **Security**: JWT authentication for protected routes

## Testing Strategy

- **Unit Tests**: Frontend (Vitest) + Backend (Jest)
- **E2E Tests**: Playwright covering signup/login flows
- **Component Tests**: React Testing Library with accessibility testing (jest-axe)

## Development Notes

- All services support hot reloading in development
- Database schemas auto-sync in development
- Stripe operates in test mode by default
- i18n supports English and French
- Email templates use React Email for consistent styling
- Rate limiting prevents API abuse
- CORS configured for cross-service communication