import { configureStore, createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "cache_img",
  initialState: {
    imageUri: null,
  },
  reducers: {
    setImageUri(state, action) {
      state.imageUri = action.payload;
    },
  },
});


const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    userIssues: [],
    localIssues: [],
  },
  reducers: {
    setUserIssues(state, action) {
      state.userIssues = action.payload;
    },
    setLocalIssues(state, action) {
      state.localIssues = action.payload;
    },
    addUserIssue(state, action) {
      state.userIssues.unshift(action.payload); 
    },
    addLocalIssue(state, action) {
      state.localIssues.unshift(action.payload); 
    },
  },
});

export const {
  setImageUri,
} = imageSlice.actions;

export const {
  setUserIssues,
  setLocalIssues,
  addUserIssue,
  addLocalIssue,
} = issuesSlice.actions;

const store = configureStore({
  reducer: {
    cache_img: imageSlice.reducer,
    issues: issuesSlice.reducer,
  },
});

export default store;
