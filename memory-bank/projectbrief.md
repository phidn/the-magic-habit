# MagicHabit Project Brief

## Project Overview
MagicHabit is a habit tracking application designed to help users build and maintain habits through small, achievable steps. The core philosophy is "Make it so easy you can't say no" - focusing on simplicity to encourage consistent progress.

## Core Requirements
1. Habit tracking with various check-in methods (done, done with note, numeric value)
2. User authentication and profile management
3. Mobile and web interfaces
4. Data visualization of habit progress
5. Widget capability for external embedding

## Technical Stack
- **Monorepo Structure**: Nx-managed repository
- **Frontend**: 
  - Web: React, Next.js, Shadcn/UI, Zustand, React Query, React Hook Form
  - Mobile: React Native, React Native Paper
- **Backend**: Golang with Pocketbase
- **Database**: SQLite
- **Authentication**: JWT-based authentication system

## Key Features
1. **Habit Management**:
   - Create, update, delete habits
   - Set metrics, colors, and ordering
   - Track streaks and progress
   
2. **Check-in System**:
   - Multiple check-in types: simple completion, notes, numeric values
   - Historical data analysis
   
3. **User System**:
   - Profile management
   - Role-based access control
   - User settings
   
4. **Widget System**:
   - External embedding via API keys
   - Public/private habit visibility

## Project Goals
1. Create an intuitive habit tracking system
2. Enable progress visualization
3. Support both web and mobile platforms
4. Ensure data security and privacy
5. Provide customization options for users

## Constraints
1. Performance optimization for mobile devices
2. Data privacy compliance
3. Offline capabilities
4. Scalable architecture 
