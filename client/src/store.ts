// src/store.ts

import { configureStore } from "@reduxjs/toolkit";
import alertMessageReducer from "./reducers/alertMessageReducer";
import loggedUserReducer from "./reducers/loggedUserReducer";
import notificationReducer  from "./reducers/notificationReducer";

const store = configureStore({
    reducer: {
        alertMessage: alertMessageReducer,
        user: loggedUserReducer,
        notifications: notificationReducer
    }
})

export default store;

// Infer types for dispatch and state
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch