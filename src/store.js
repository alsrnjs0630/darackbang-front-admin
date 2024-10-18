import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducer/loginSlice";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use local storage
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';

import { encryptTransform } from 'redux-persist-transform-encrypt';


const encryptor = encryptTransform({
    secretKey: 'darackbang-user-info-secret-key', // Replace with your own secret key
    onError: function (error) {
        // Handle the error if any encryption/decryption issues occur
        console.error("Encryption Error:", error);
    }
});

// Persist configuration
const persistConfig = {
    key: 'root', // key for the root persisted state
    storage,
    transforms: [encryptor], // Apply encryption transform
};

// Persist the login slice reducer
const persistedReducer = persistReducer(persistConfig, loginSlice);

// Create store with the persisted reducer
const store = configureStore({
    reducer: {
        loginSlice: persistedReducer, // Apply persisted reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // redux-persist 관련 비직렬화된 액션 무시
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
