# MagicHabit Technical Context

## Technology Stack

### Frontend
- **Web Application**
  - **Framework**: React 18+ with Next.js 14
  - **UI Components**: shadcn/ui (based on Radix UI)
  - **Styling**: Tailwind CSS
  - **State Management**:
    - TanStack Query (v4) for server state
    - Zustand for client state
  - **Form Handling**: React Hook Form with Zod validation
  - **Routing**: Next.js App Router
  - **Icons**: Lucide icons

- **Mobile Application**
  - **Framework**: React Native
  - **UI Components**: React Native Paper
  - **Navigation**: React Navigation
  - **State Management**: Same as web (TanStack Query + Zustand)
  - **Form Handling**: Same as web (React Hook Form + Zod)

### Backend
- **Language**: Golang
- **Framework**: Pocketbase (embedded SQLite + web server)
- **API Style**: RESTful
- **Authentication**: JWT
- **Validation**: ozzo-validation
- **Database**: SQLite (via Pocketbase)
- **Query Builder**: dbx (Pocketbase's query builder)
- **Email System**: HTML templates for authentication emails (verify_email.html, forgot_password.html)

### Infrastructure
- **Repository**: Monorepo managed with Nx
- **Package Management**: Yarn
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Deployment**: 
  - Web: Vercel
  - Server: Docker containers

## Development Environment

### Prerequisites
- Node.js 18+
- Go 1.20+
- Yarn
- Docker (optional)

### Local Setup
```bash
# Clone repository
git clone https://github.com/yourusername/mazic-habit.git

# Install dependencies
yarn install

# Run development server
yarn dev
```

### Key Environment Variables
- `PORT`: Server port
- `ENV`: Environment (development, production)
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGINS`: Allowed CORS origins

## Database Schema

MagicHabit uses PocketBase's SQLite database with the following key collections:

### 1. User Collection (`sys_user`)
- Standard user fields (email, password hash, etc.)
- Custom fields for profile info (first name, last name, etc.)
- Role-based access control fields

### 2. User Settings (`sys_user_setting`)
- User-specific settings (timezone, UI preferences)
- Telegram integration settings

### 3. Habit Collection (`mz_habits`)
- Habit details (title, metric, color)
- Visibility settings
- API key for widget embedding
- Order for custom sorting

### 4. Check-in Collection (`mz_check_ins`)
- Related habit reference
- Date of check-in
- Value (numeric or boolean)
- Optional notes

## API Structure

### Authentication Endpoints
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

### Habit Endpoints
- `GET /mz/habits` - List habits
- `GET /mz/habits/:id` - Get single habit
- `POST /mz/habits` - Create habit
- `PUT /mz/habits/:id` - Update habit
- `DELETE /mz/habits/:id` - Delete habit
- `GET /mz/habits/widget/:api_key` - Widget data

### Check-in Endpoints
- `GET /mz/check-ins` - List check-ins
- `POST /mz/check-ins` - Create check-in
- `PUT /mz/check-ins/:id` - Update check-in
- `DELETE /mz/check-ins/:id` - Delete check-in

### User Endpoints
- `GET /api/user` - Get user data
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

## External Dependencies

### Frontend Dependencies
- `@tanstack/react-query`: Data fetching and caching
- `react-hook-form`: Form state management
- `zod`: Schema validation
- `zustand`: State management
- `@radix-ui/react-*`: UI primitives
- `tailwindcss`: Utility-first CSS
- `lucide-react`: Icon library

### Backend Dependencies
- `github.com/pocketbase/pocketbase`: Core framework
- `github.com/pocketbase/dbx`: Database query builder
- `github.com/go-ozzo/ozzo-validation`: Validation library
- `golang.org/x/crypto`: Cryptography functions

## Known Technical Constraints

1. **SQLite Limitations**:
   - Not designed for high-concurrency environments
   - Limited to single-writer pattern

2. **Mobile Constraints**:
   - React Native performance considerations
   - Platform-specific UI behaviors
   - Code push limitations

3. **Authentication Limitations**:
   - JWT token size constraints
   - Refresh token security considerations

4. **API Rate Limiting**:
   - Basic rate limiting implementation
   - Potential for abuse in widget endpoints

5. **Offline Support**:
   - Limited offline capabilities
   - Sync conflicts resolution needed 
