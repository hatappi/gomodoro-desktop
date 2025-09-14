# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gomodoro Desktop is an Electron-based Pomodoro timer application that integrates with a Go backend server. The app features a system tray interface and a React-based UI for task management and timer controls with keyboard shortcuts support.

## Development Commands

### Core Development

- `npm start` - Start the application in development mode with hot reload
- `npm run typecheck` - Run TypeScript compiler to check types without emitting files
- `npm run lint` - Run ESLint on TypeScript/TSX files
- `npm run format` - Check code formatting with Prettier

### GraphQL Code Generation

- `npm run codegen` - Generate TypeScript types from GraphQL schema (requires backend server running on localhost:8080)

### Building and Distribution

- `npm run package` - Package the app using Electron Forge
- `npm run make` - Create distributable packages (ZIP for macOS)
- `npm run publish` - Publish to GitHub releases

## Architecture

### Main Process (`src/main/`)

- **Application.ts** - Core application lifecycle management, manages backend server connection
- **main.ts** - Electron app entry point, handles single instance lock and auto-updater
- **TrayManager.ts** - System tray integration and menu management
- **Services/** - Backend communication (GraphQL, Notifications, Pomodoro logic)

The main process automatically starts a `gomodoro serve` CLI process if it can't connect to an existing backend server at localhost:8080.

### Renderer Process (`src/renderer/`)

- **App.tsx** - Main React component with timer and task management UI
- **hooks/** - Custom React hooks for pomodoro state and task management
- **components/** - Modular UI components (Timer, Controls, TaskManager with keyboard shortcuts, Layout)

### Shared (`src/shared/`)

- **types/** - TypeScript type definitions shared between processes
- **graphql/generated.ts** - Auto-generated GraphQL types and operations
- **constants.ts** - Environment-configurable URLs for GraphQL endpoints

### Architecture Pattern

The app follows a client-server architecture where the Electron app communicates with a separate Go backend via GraphQL (HTTP + WebSocket subscriptions). The backend handles pomodoro state persistence and task management.

## Key Dependencies

### Production

- **Electron** - Desktop app framework
- **React** - UI framework
- **Material-UI v5** - Component library and theming
- **Apollo Client** - GraphQL client with subscription support
- **update-electron-app** - Auto-updater functionality

### Development

- **Electron Forge** - Build toolchain and packaging
- **Vite** - Fast build tool for main/preload/renderer processes
- **GraphQL Code Generator** - Type-safe GraphQL operations
- **TypeScript** - Static typing throughout the codebase

## Environment Configuration

GraphQL endpoints can be configured via environment variables:

- `GRAPHQL_HTTP_URL` (default: http://localhost:8080/graphql/query)
- `GRAPHQL_WS_URL` (default: ws://localhost:8080/graphql/query)

## Build Configuration

- **forge.config.ts** - Electron Forge configuration for packaging and distribution
- **vite.\*.config.ts** - Separate Vite configs for main, preload, and renderer processes
- **codegen.ts** - GraphQL code generation targeting local backend server

## Integration Notes

The app expects a compatible `gomodoro` CLI tool to be available in PATH for automatic backend server startup. The GraphQL schema should match the queries/mutations defined in `src/main/graphql/**.graphql`.

## Common Workflows

When adding new GraphQL operations:

1. Add `.graphql` files to `src/main/graphql/`
2. Run `npm run codegen` to generate TypeScript types
3. Import and use the generated operations in services or hooks

When modifying the UI:

- Use Material-UI components and the theme defined in `src/renderer/styles/theme.ts`
- Follow the existing component structure and prop patterns
- Custom hooks should be placed in `src/renderer/hooks/`
- TaskManager supports keyboard shortcuts for navigation and actions

## Recent Features

### Keyboard Shortcuts (v0.0.16)

The TaskManager component now includes comprehensive keyboard shortcuts:

- Navigation: Arrow keys, Home/End, Page Up/Down
- Task management: Delete key for task deletion
- Enhanced task selection and workflow integration
