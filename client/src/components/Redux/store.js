import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from "redux";
import userReducer  from "../features/slice";
import adminReducer from "../features/adminSlice";

const persistConfig = {
  key: "root", // root-level persist key
  storage,
  whitelist: ["user", "admin"], // specify which reducers to persist
};
const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
});

const persistedUserReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedUserReducer
    
})

export const persistor = persistStore(store);
export default store;