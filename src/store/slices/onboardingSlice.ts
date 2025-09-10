import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  loading: boolean;
}

const initialState: OnboardingState = {
  hasSeenOnboarding: false,
  loading: true,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingSeen: (state) => {
      state.hasSeenOnboarding = true;
      AsyncStorage.setItem('hasSeenOnboarding', 'true');
    },
    setOnboardingState: (state, action: PayloadAction<boolean>) => {
      state.hasSeenOnboarding = action.payload;
      state.loading = false;
    },
    setOnboardingLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setOnboardingSeen,
  setOnboardingState,
  setOnboardingLoading,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;