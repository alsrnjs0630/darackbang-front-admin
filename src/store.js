import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducer/loginSlice";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use local storage

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
});

const persistor = persistStore(store);

export { store, persistor };
