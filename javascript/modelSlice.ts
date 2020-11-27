import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Model {
  displayType: 'issues' | 'comments';
  issueId: number | null;
}

interface ModelPayload {
  displayType: 'issues' | 'comments';
  issueId?: number;
}

interface CurrentRepo {
  org: string;
  repo: string;
}

type ModelState = {
  page: number;
} & Model &
  CurrentRepo;

const initialState: ModelState = {
  org: 'rails',
  repo: 'rails',
  page: 1,
  displayType: 'issues',
  issueId: null,
};

const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    displayRepo(state, action: PayloadAction<CurrentRepo>) {
      const { org, repo } = action.payload;
      state.org = org;
      state.repo = repo;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setModelType(state, action: PayloadAction<ModelPayload>) {
      const { displayType, issueId = null } = action.payload;
      state.displayType = displayType;
      state.issueId = issueId;
    },
  },
});

export const { displayRepo, setModelType, setCurrentPage } = modelSlice.actions;

export default modelSlice.reducer;
