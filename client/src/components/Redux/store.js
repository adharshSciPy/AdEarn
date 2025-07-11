import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

// Reducers
import userReducer from "../features/slice";
import adminReducer from "../features/adminSlice";
import notificationReducer from "../features/notificationSlice"; // 🔔 Add this

// 🔐 Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "admin"], // 🔁 Do NOT persist notification unless needed
};

// 🔗 Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  notification: notificationReducer, // ✅ Included but not persisted
});

// 🎯 Apply persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗️ Create store
const store = configureStore({
    reducer: persistedReducer,
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: false, // Needed for redux-persist
    //   }),
});

// 🚀 Create persistor
export const persistor = persistStore(store);
export default store;
