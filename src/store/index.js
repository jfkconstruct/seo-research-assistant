import { configureStore } from '@reduxjs/toolkit';

// Initial reducers
const rootReducer = {
  // Add reducers here as needed
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
