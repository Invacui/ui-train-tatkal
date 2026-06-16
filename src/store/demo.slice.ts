import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DemoState {
  isDemoMode: boolean;
  demoTokensUsed: number;
}

export const demoSlice = createSlice({
  name: 'demo',
  initialState: { isDemoMode: false, demoTokensUsed: 0 } as DemoState,
  reducers: {
    enableDemo: (state) => {
      state.isDemoMode = true;
    },
    disableDemo: (state) => {
      state.isDemoMode = false;
      state.demoTokensUsed = 0;
    },
    incrementDemoTokens: (state, { payload }: PayloadAction<number>) => {
      state.demoTokensUsed += payload;
    },
  },
});

export const { enableDemo, disableDemo, incrementDemoTokens } = demoSlice.actions;
export const demoReducer = demoSlice.reducer;

export const selectIsDemoMode = (s: { demo: DemoState }) => s.demo.isDemoMode;
export const selectDemoTokensUsed = (s: { demo: DemoState }) => s.demo.demoTokensUsed;
