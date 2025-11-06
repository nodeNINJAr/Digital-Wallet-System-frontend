import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import { setupListeners } from '@reduxjs/toolkit/query'
import { api } from './services/api';
import authReducer from './slice/authSlice';
import themeReducer from './slice/themeSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(api.middleware),
});



setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch