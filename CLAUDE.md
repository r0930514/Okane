# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (NestJS)
- `cd backend && pnpm install` - Install dependencies
- `pnpm run start:dev` - Run backend in development mode with hot reload
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Run production build
- `pnpm run lint` - Run ESLint
- `pnpm run test` - Run unit tests
- `pnpm run test:e2e` - Run end-to-end tests
- `pnpm run test:cov` - Run tests with coverage

### Frontend (React + Vite)
- `cd frontend && pnpm install` - Install dependencies
- `pnpm run dev` - Run development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Database Migrations
- `npm run migration:generate` - Generate migration from entity changes
- `npm run migration:run` - Apply pending migrations
- `npm run migration:revert` - Revert last migration

### Docker
- `docker-compose -f docker/docker-compose.yaml up` - Run full stack
- `docker-compose -f docker/docker-compose-dev.yaml up` - Run development environment
- `docker exec -it okane-backend sh` - Access backend container for migrations

## Architecture Overview

### Core System Structure
Okane is a multi-currency asset management system with a **NestJS backend** and **React frontend**. The system handles:
- Multi-currency wallet management
- Real-time exchange rate conversion
- Transaction tracking with cost basis calculations
- JWT authentication with user management

### Backend Architecture (NestJS)
- **Modular Design**: Uses NestJS modules for separation of concerns
- **Main Modules**:
  - `AuthModule` - JWT authentication, local/passport strategies
  - `UsersModule` - User management and profiles
  - `WalletModule` - Contains all wallet-related functionality
- **Database**: PostgreSQL with TypeORM
- **Entities**: User, Wallet, Transaction, WalletModule, WalletConfig
- **API Documentation**: Swagger available at `/docs` endpoint

### Frontend Architecture (React)
- **Feature-Based Structure**: Organized by domain features
- **Main Features**:
  - `auth` - Login/registration pages and authentication logic
  - `dashboard` - Main application dashboard with wallet overview
  - `homepage` - Landing page with marketing content
- **Routing**: React Router with protected routes
- **State Management**: Uses React hooks and context
- **UI Framework**: TailwindCSS with DaisyUI components

### Database Schema
- **Users**: Authentication and profile data
- **Wallets**: Container for assets, supports multiple currencies
- **Transactions**: All financial movements (income, expense, transfers)
- **WalletModules**: Wallet type definitions and configurations
- **WalletConfigs**: User-specific wallet settings

### Key Business Logic
- **Multi-Currency Support**: Assets can be held in different currencies within same wallet
- **Exchange Rate Handling**: Real-time conversion using external APIs
- **Cost Basis Calculation**: Supports FIFO and weighted average methods
- **Net Worth Calculation**: Converts all assets to user's primary currency

### API Structure
- **Authentication**: `/auth` endpoints for login/register
- **Users**: `/users` for user management
- **Wallets**: `/wallets` for wallet CRUD operations
- **Transactions**: `/transactions` for transaction management
- **Wallet Modules**: `/wallet-modules` for wallet type definitions
- **Wallet Configs**: `/wallet-configs` for wallet configuration

### Development Environment
- **Package Manager**: Uses `pnpm` for both frontend and backend
- **Hot Reload**: Both frontend (Vite) and backend (NestJS) support hot reload
- **Database**: PostgreSQL runs in Docker container
- **API Documentation**: Swagger UI available in development
- **CORS**: Enabled for frontend-backend communication

### Testing Strategy
- **Backend**: Jest for unit testing, separate e2e test configuration
- **Frontend**: Standard React testing setup with Vite
- **Database**: Uses migrations for schema management, avoid synchronize in production

### Production Deployment
- **Containerization**: Multi-stage Docker builds for both services
- **Web Server**: Nginx serves frontend and proxies API calls
- **Database**: PostgreSQL with persistent volumes
- **Ports**: Frontend on 82, Backend on 3000, Database on 5432
- **Environment Variables**: Database credentials, JWT secrets via Docker environment

## Localization Guidelines
- **Localization Preference**: 請使用繁體中文回答 - Indicates a preference for Traditional Chinese responses