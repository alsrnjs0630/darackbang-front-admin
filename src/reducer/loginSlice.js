import {createSlice} from '@reduxjs/toolkit';

export const loginSlice  = createSlice({

    name: "LoginSlice",
    initialState: {
        name:"",
        id:"",
        isLoading:false,
        isLogin:null,

    },
    reducers: {
        login: (state, action) => {

            console.log(action.payload);

            state.name = action.payload.nickname;
            state.email = action.payload.email;
            state.roleNames = action.payload.roleNames;
            state.isLoading = true;
            state.isLogin = true;
        },
        logout:(state, action) => {
            state.name ="";
            state.email = "";
            state.roleNames =[];
            state.isLoading = false;
            state.isLogin = false;
        }
    },

})

export const {login, logout} = loginSlice.actions;
export default loginSlice.reducer;