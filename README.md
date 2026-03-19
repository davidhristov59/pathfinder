# PathFinder

PathFinder is a comprehensive React Native app built with Expo, dedicated to tracking and recording your GPS activities. With PathFinder, users can record paths, visualize their activity on a map, and review their history of past tracks.

## Features

- **Real-Time GPS Tracking**: Tracks your activity continuously while the app is in the foreground.
- **Background Location Tracking**: PathFinder seamlessly tracks your position in the background using `expo-location` and `expo-task-manager` so you can lock your device or switch apps.
- **Interactive Maps**: Experience smooth map tracking using `react-native-maps` enriched with a smooth UI.
- **Local History & Database**: Saves all your recorded activities locally onto your device using `expo-sqlite`, ensuring offline capabilities and data privacy.
- **Activity Details**: Delve into the details of any past activity with a specialized activity recap screen.
- **Dark Mode Optimized UI**: Modern styling implemented through `tailwind-css` and `nativewind`.

## Tech Stack

The architecture focuses on a production-ready setup utilizing modern libraries:

- **Framework**: [React Native](https://reactnative.dev) & [Expo](https://expo.dev/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) configured with an intuitive tab-based navigation.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [NativeWind v4](https://www.nativewind.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/), lightweight, fast, and scalable bearbones state-management.
- **Database**: `expo-sqlite` for all local storage needs (storing coordinate streams, distance, and timestamps).
- **Location Services**: `expo-location` and `expo-task-manager` for reliable foreground and background task executions.
- **Maps**: `react-native-maps` configured with Web compatibility.
- **Animations**: `react-native-reanimated` & `moti`.
- **Icons**: `lucide-react-native`.

## Project Structure

```text
pathfinder/
├── app/                  # Expo Router directory
│   ├── (tabs)/           # Main tab navigation
│   │   ├── index.tsx     # Current tracking screen
│   │   └── history.tsx   # Activity history list
│   ├── activity/
│   │   └── [id].tsx      # Activity details screen
│   └── _layout.tsx       # Root layout, background task registration
├── components/           # Reusable UI components
│   ├── ActivityCard.tsx  # Card displaying an activity in the history
│   ├── CurrentLocationDot.tsx
│   ├── PermissionGate.tsx# Screen enforcing layout logic until permissions are granted
│   ├── StatsBar.tsx      # Real-time tracking statistics displaying speed, distance
│   └── TrackingMap.tsx   # Core maps component integrating with react-native-maps
├── services/             # Core business logic and integrations
│   ├── backgroundTask.ts # Task implementations for in-background location callbacks
│   ├── database.ts       # SQLite setup, schemas, inserts, and queries
│   ├── distance.ts       # Haversine formula and mathematical utilities
│   └── location.ts       # Main location monitoring hooks / methods
├── store/                # Global app state management (Zustand)
│   └── trackingStore.ts  # Current activity state, elapsed time, current path coordinates
├── assets/               # Splash screens, static icons, configurations
└── package.json          # Dependencies and scripts
```

## Setup & Run Local Development

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or an Expo Go companion app on your physical device)

### Installation

1. Clone this repository locally.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file at the root of the project to set up your maps provider key (MapTiler):

```env
EXPO_PUBLIC_MAPTILER_KEY=your_key_here
```

> _You can acquire a free API key at [MapTiler](https://maptiler.com)._

### Running the App

Run the development server using Expo:

```bash
npx expo start
```

From the CLI menu, press:

- `i` to launch on the iOS simulator
- `a` to launch on the Android emulator
- Or scan the QR code using your phone's camera (iOS) or Expo Go App (Android).

## Key Implementation Highlights

- **Background Location Logic**: Background tracking relies heavily on defining the event listeners (i.e. `TaskManager.defineTask`) within the uppermost root layout (`app/_layout.tsx`) so that they are continuously evaluated at the very top level, preventing component unmounting loops gracefully.
- **Location Permissions Management**: `PermissionGate.tsx` serves as a comprehensive gateway guaranteeing precise permissions sets are correctly authorized—including persistent background checks—before user tracks are initiated.
