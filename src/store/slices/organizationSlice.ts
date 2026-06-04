import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id: number | string;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  createdAt: string;
}

interface OrganizationState {
  jobs: Job[];
  isLoadingJobs: boolean;
  activeTab: string;
}

const initialState: OrganizationState = {
  jobs: [],
  isLoadingJobs: false,
  activeTab: 'overview',
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.isLoadingJobs = false;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload);
    },
    setLoadingJobs: (state, action: PayloadAction<boolean>) => {
      state.isLoadingJobs = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    }
  },
});

export const { setJobs, addJob, setLoadingJobs, setActiveTab } = organizationSlice.actions;
export default organizationSlice.reducer;
