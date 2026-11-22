import { configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import type { ReactNode } from 'react';
import planetsReducer from './planetsSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    planets: planetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function AppStoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export {
  fetchPlanets,
  selectPlanet,
  setPlanetAngle,
  type Planet,
  type PlanetId,
} from './planetsSlice';
export { setTheme, toggleTheme } from './themeSlice';
export {
  calculateAngle,
  calculateOrbitPosition,
  getMobileOrbitRadius,
} from './orbit';
export { formatDegrees } from '@solar-system/api';
