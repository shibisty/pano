import { configureStore } from "@reduxjs/toolkit";
import { exampleApi } from "./services/exampleApi";
import { lunaApi } from "./services/lunaApi";
import { assetsApi } from "./services/assetsApi";


export const store = configureStore({
  reducer: {
    [exampleApi.reducerPath]: exampleApi.reducer,
    [lunaApi.reducerPath]: lunaApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(exampleApi.middleware)
      .concat(lunaApi.middleware)
      .concat(assetsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
