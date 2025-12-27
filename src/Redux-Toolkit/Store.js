import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import inventoryReducer from "./slices/inventorySlice";
import jobCardReducer from "./slices/jobCardSlice";
import servicesReducer from "./slices/servicesSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    jobCard: jobCardReducer,
    services: servicesReducer, // Make sure this key is 'services'
  },
});
