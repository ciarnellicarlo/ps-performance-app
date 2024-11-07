# PlayStation Performance Repository

A full-stack application that tracks and compares game performance across different PlayStation console variants (PS4, PS4 Pro, PS5, and PS5 Pro). Users can view and submit performance metrics like FPS and resolution for different graphics modes.

## Live Demo

Check out the live application: [PS Performance App](https://ps-performance-app-pkkr.vercel.app/)

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: Go
- **Database**: MongoDB
- **External API**: IGDB (Internet Game Database)

## Features

- Search and view PlayStation games
- Performance metrics tracking (FPS, resolution)
- Multiple graphics modes support (Fidelity/Performance)
- Responsive design (mobile/desktop layouts)
- Real-time game data synchronization with IGDB

In the backend we are missing:
the database folder inside the internal folder

in the frontend-web
the api folder containing the GameApi.ts file
the services folder containing the api.ts file
the pages folder
the config folder
the hooks folder

## Project Structure
├── backend/
│   ├── cmd/
│   │   └── api/         # Entry point and routes
│   ├── internal/
│   │   ├── database/    # Database connection and configuration
│   │   ├── models/      # Data models and types
│   │   ├── repository/  # Database operations (MongoDB queries)
│   │   └── services/    # Business logic
│   └── pkg/
│       └── igdb/       # External API integration
├── frontend-web/
│   ├── src/
│   │   ├── api/         # API client configuration
│   │   ├── components/  # Reusable React components
│   │   ├── config/      # Environment and app configuration
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Next.js page components
│   │   ├── services/    # API service layers
│   │   ├── styles/      # SCSS modules
│   │   ├── types/       # TypeScript definitions
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets

## API Endpoints

- `GET /random-games` - Get random games list
- `GET /search?q={query}` - Search games
- `GET /games/{id}` - Get game details
- `POST /games/{id}/performance` - Submit performance data

## Future Improvements

### Architecture & Code Quality
- Implement proper state management (Redux/Context) for:
  - Search results caching
  - Performance submission tracking
  - User session management
- Separate layout components from feature components for better reusability
- Add error handling package for consistent API responses
- Add dedicated configuration package for environment variables
- Implement interfaces for services/repositories to improve testability

### Features & User Experience
- Add user authentication system
- Implement community voting system for performance data:
  - Require 5 matching submissions before accepting new specifications
  - Show "Under Review" status for pending submissions
  - Prevent direct specification changes without consensus
  - Track user submissions across session
  - Add data validation middleware