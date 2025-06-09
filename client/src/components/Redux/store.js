import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "react-persist";
import { combineReducers } from "redux";
import { userReducer } from "../features/slice";

const persistConfig = {
    key: "user",
    storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
    reducer:{
        user: persistedUserReducer
    }
})

export const persistor = persistStore(store);
export default store;