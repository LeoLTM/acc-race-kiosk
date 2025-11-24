# Assetto Corsa Race Kiosk Application

## Overview

This application manages queue-based racing sessions for Assetto Corsa across multiple racing rigs. Users can join queues via a web interface, and racing rigs automatically handle player onboarding and session management.

## Architecture

- **Control Server Backend** (`control_server/backend/`): Node.js/TypeScript REST API managing queues and rig states
- **Web UI** (`control_server/frontend/`): User-facing interface for queue management and dashboard display
- **Race Interceptor** (`race_interceptor/`): Python application running on each racing rig intercepting Content Manager's `race.ini` file to inject player names

## User Flow

### Player Registration
1. User enters their name via the web UI
2. Backend assigns user to the racing rig with the shortest queue
3. Dashboard displays current queue states (current player + next 3 in queue)

### Racing Rig States
- **FREE**: Idle, checking for queued players every 1 seconds
- **RACING**: Active session, not accepting new players

### Session Workflow

#### 1. Player Assignment
- Rig in `FREE` state polls backend for next player in queue
- If player found, displays UI: "Start as `PlayerName`" | "Skip"

#### 2. Session Initialization
- On "Start" click: watchdog monitors `race.ini` file for changes
- When Content Manager writes default player name to `race.ini`, watchdog immediately overrides it with queued player name
- Rig transitions to `RACING` state

#### 3. Session Completion
- Player clicks finish button when done
- Backend removes player from queue
- Rig returns to FREE state and checks for next player

### Key Features
- **Automatic load balancing**: Players assigned to shortest queue
- **File-based name injection**: Intercepts Content Manager's `race.ini` writes
- **Real-time dashboard**: Displays current and upcoming players across all rigs