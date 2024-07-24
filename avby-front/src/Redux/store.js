import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authSlice";
import carReduser from "./reducers/carSlice";
import messageInfoReduser from "./reducers/messageInfoSlice";
import userReduser from "./reducers/userSlice";
import filterReducer from "./reducers/filterSlice"


const store = configureStore({
    reducer:{
        auth: authReducer,
        cars: carReduser,
        message: messageInfoReduser,
        user: userReduser,
        filter: filterReducer,
    }
})

export default store