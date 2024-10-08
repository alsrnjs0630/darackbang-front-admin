import {configureStore} from "@reduxjs/toolkit";
import loginSlice from "./reducer/loginSlice";

export default  configureStore({
    reducer: {
        "loginSlice": loginSlice
    }
})