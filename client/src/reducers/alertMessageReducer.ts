import {createSlice } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';

export type AlertState = {
    message: string | null;
    type: "success" | "error" | "info";
  };
  
const initialState: AlertState = {
    message: null,
    type: "info",
};

const alertMessageSlicer = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlertMessage(_, action) {
            return action.payload;
        },
        removeAlertMessage() {
            return {message: null, type: 'info'}
        }
    }
})

export const {setAlertMessage, removeAlertMessage} = alertMessageSlicer.actions

export const alertMessageHandler = (alertMessage: AlertState, time: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(setAlertMessage(alertMessage))
        setTimeout(() => {
            dispatch(removeAlertMessage())
        },time * 1000)

    }
}

export default alertMessageSlicer.reducer