import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getPlanetPositions,
  INITIAL_PLANETS,
  mergePlanetPositions,
  type Planet,
  type PlanetId,
} from '@solar-system/api';

export type { Planet, PlanetId } from '@solar-system/api';

interface PlanetsState {
  planets: Planet[];
  selectedPlanet: PlanetId | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updatedAt: string | null;
}

const initialState: PlanetsState = {
  planets: INITIAL_PLANETS,
  selectedPlanet: null,
  status: 'idle',
  error: null,
  updatedAt: null,
};

export const fetchPlanets = createAsyncThunk(
  'planets/fetchPlanets',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getPlanetPositions(signal);
    } catch (error) {
      if (signal.aborted) throw error;
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown API error',
      );
    }
  },
);

const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
    selectPlanet(state, action: { payload: PlanetId | null }) {
      state.selectedPlanet = action.payload;
    },
    setPlanetAngle(
      state,
      action: { payload: { id: PlanetId; angle: number } },
    ) {
      const planet = state.planets.find((item) => item.id === action.payload.id);
      if (planet) planet.angle = action.payload.angle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlanets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.updatedAt = action.payload.datetime;
        state.planets = mergePlanetPositions(state.planets, action.payload);
      })
      .addCase(fetchPlanets.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to load planets';
      });
  },
});

export const { selectPlanet, setPlanetAngle } = planetsSlice.actions;
export default planetsSlice.reducer;
