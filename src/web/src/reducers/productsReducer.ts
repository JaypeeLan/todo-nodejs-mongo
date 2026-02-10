import { ActionTypes, AppActions } from "../actions/common";
import { Product } from "../models";
import { Reducer } from "react";

export const productsReducer: Reducer<Product[] | undefined, AppActions> = (state: Product[] | undefined, action: AppActions): Product[] | undefined => {
    switch (action.type) {
        case ActionTypes.LOAD_PRODUCTS:
            return action.payload ? [...action.payload] : [];
        case ActionTypes.SAVE_PRODUCT:
            if (state) {
                const index = state.findIndex(p => p.id === action.payload.id);
                if (index > -1) {
                    const nextState = [...state];
                    nextState[index] = action.payload;
                    return nextState;
                } else {
                    return [...state, action.payload];
                }
            }
            return [action.payload];
        case ActionTypes.DELETE_PRODUCT:
            return state ? state.filter(p => p.id !== action.payload) : state;
        default:
            return state;
    }
}
