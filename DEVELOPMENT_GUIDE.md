
# MedallionMart Development Guide

## Step-by-Step Development Process

### 1. Initial Setup
```bash
# Install all dependencies
npm install

# Type check the project
npm run check
```

### 2. Database Setup
```bash
# Push database schema
npm run db:push
```

### 3. Development Mode
```bash
# Start development server (React + Express)
npm run dev
```
Access your app at: `https://your-repl-name.replit.dev`

### 4. Production Build
```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

### Frontend (`/client`)
- **Pages**: `/client/src/pages/` - All React pages (home, products, cart, etc.)
- **Components**: `/client/src/components/` - Reusable UI components
- **Hooks**: `/client/src/hooks/` - Custom React hooks
- **Lib**: `/client/src/lib/` - Utilities and configurations

### Backend (`/server`)
- **index.ts**: Main Express server
- **routes.ts**: API route definitions
- **auth.ts**: Authentication logic
- **storage files**: Database implementations (MongoDB, simple storage)

### Shared (`/shared`)
- **schema.ts**: Shared TypeScript types and schemas

## Development Workflow

### 1. Adding New Features
1. Create/modify components in `/client/src/components/`
2. Add new pages in `/client/src/pages/`
3. Update API routes in `/server/routes.ts`
4. Test changes with `npm run dev`

### 2. Database Changes
1. Modify schema in `/shared/schema.ts`
2. Update storage files in `/server/`
3. Run `npm run db:push` to sync changes

### 3. Authentication
- Uses Replit Auth system
- Authentication logic in `/server/auth.ts`
- Frontend auth hooks in `/client/src/hooks/useAuth.ts`

### 4. Styling
- Uses TailwindCSS
- UI components in `/client/src/components/ui/`
- Custom styles in `/client/src/index.css`

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema

## Port Configuration
- Development: Port 5000 (automatically forwarded)
- The app serves both frontend and backend on the same port

## Environment Variables
Set up any required environment variables in Replit Secrets:
- Database connection strings
- API keys
- Authentication secrets

## Debugging
1. Check console for errors
2. Use browser dev tools for frontend debugging
3. Server logs are displayed in the console
4. API requests are logged with response details

## Deployment
Your app is automatically deployable on Replit. The `.replit` file is configured to run your development server.
