import { createStore, useStore } from 'zustand';
import { Coordinate } from '../services/distance';

export interface TrackingState {
  isTracking: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  coordinates: Coordinate[];
  currentLocation: Coordinate | null;
  locationPermission: 'granted' | 'denied' | 'undetermined';
}

export interface TrackingActions {
  startTracking: () => void;
  stopTracking: () => void;
  addCoordinate: (coord: Coordinate) => void;
  setCurrentLocation: (coord: Coordinate) => void;
  tick: () => void;
  setPermission: (status: 'granted' | 'denied' | 'undetermined') => void;
  reset: () => void;
}

export const trackingStore = createStore<TrackingState & TrackingActions>((set) => ({
  isTracking: false,
  startTime: null,
  elapsedSeconds: 0,
  coordinates: [],
  currentLocation: null,
  locationPermission: 'undetermined',

  startTracking: () => set({ isTracking: true, startTime: new Date(), elapsedSeconds: 0, coordinates: [] }),
  stopTracking: () => set({ isTracking: false }),
  addCoordinate: (coord) => set((state) => ({ coordinates: [...state.coordinates, coord] })),
  setCurrentLocation: (coord) => set({ currentLocation: coord }),
  tick: () => set((state) => ({ elapsedSeconds: Math.floor((new Date().getTime() - (state.startTime?.getTime() || new Date().getTime())) / 1000) })),
  setPermission: (status) => set({ locationPermission: status }),
  reset: () => set({ isTracking: false, startTime: null, elapsedSeconds: 0, coordinates: [] }),
}));

export function useTrackingStore(): TrackingState & TrackingActions;
export function useTrackingStore<T>(selector: (state: TrackingState & TrackingActions) => T): T;
export function useTrackingStore<T>(selector?: (state: TrackingState & TrackingActions) => T): T | (TrackingState & TrackingActions) {
  if (selector) {
    return useStore(trackingStore, selector);
  }
  return useStore(trackingStore);
}
