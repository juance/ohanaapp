
# Lavandería Ohana - Application Structure Documentation

## Overview

This document provides a comprehensive overview of the Lavandería Ohana application architecture, code organization, and key components. It serves as a guide for both new and experienced developers working on the project.

## Application Architecture

The application follows a modular architecture with clear separation of concerns:

1. **UI Layer**: React components for user interaction
2. **State Management**: A mix of React hooks and context API
3. **Service Layer**: Business logic encapsulated in service modules
4. **Data Layer**: Supabase for backend storage with local caching for offline support

## Offline-First Approach

The application is designed with an offline-first approach:

- Local storage caching for all data
- Background synchronization when online
- Visual indicators for sync status
- Graceful error handling for network issues

## Key Features

- **Ticket Management**: Create, track, and process laundry tickets
- **Customer Management**: Store customer information and loyalty points
- **Analytics Dashboard**: Track business metrics and performance
- **Inventory Management**: Monitor supply levels
- **Expense Tracking**: Record and manage business expenses

## Code Structure

### Core Directories

- `/components`: UI components organized by feature
- `/hooks`: Custom React hooks for reusable logic
- `/lib`: Core application logic and services
  - `/data`: Data access and manipulation
    - `/sync`: Data synchronization modules
    - `/customer`: Customer-related services
    - `/ticket`: Ticket-related services
  - `/utils`: Utility functions and helpers
- `/providers`: Context providers for state management
- `/pages`: Top-level page components

### Key Files and Components

- `ConnectionStatusProvider.tsx`: Manages online/offline state and sync operations
- `DataStatusIndicator.tsx`: Visualizes sync and connection status
- `dataService.ts`: Entry point for data-related operations
- `syncService.ts`: Coordinates synchronization of offline data
- `errorHandlingService.ts`: Centralized error handling
- `validationService.ts`: Data validation using Zod schema validation

## Data Flow

1. User interactions trigger state changes via hooks and context
2. Service layer processes business logic
3. Data updates are stored locally first (offline-first)
4. Synchronization happens in the background when online
5. UI reflects current state, including sync status

## Error Handling Strategy

The application implements a comprehensive error handling strategy:

1. Centralized error handling through `errorHandlingService.ts`
2. Type-specific error handling (network, database, validation, etc.)
3. User-friendly error messages
4. Fallback mechanisms for critical operations
5. Error logging for debugging

## Testing Strategy

- Unit tests for service layer logic
- Integration tests for component interactions
- Mock service responses for predictable testing
- Separate test utilities for common testing operations

## Extending the Application

When extending the application, follow these guidelines:

1. Create new components in dedicated files
2. Keep business logic in service files
3. Use TypeScript interfaces for data structures
4. Follow the offline-first pattern for new features
5. Implement proper error handling
6. Add tests for new functionality

## Performance Considerations

- Use React Query for efficient data fetching and caching
- Implement virtualization for long lists
- Optimize heavy calculations with useMemo
- Leverage local storage for offline capabilities
- Use batch operations for synchronization when possible
