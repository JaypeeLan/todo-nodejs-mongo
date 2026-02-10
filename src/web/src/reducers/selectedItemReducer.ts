import { ActionTypes, AppActions } from "../actions/common";
import { Product } from "../models";
import { Reducer } from "react";

export const selectedItemReducer: Reducer<Product | undefined, AppActions> = (state: Product | undefined, action: AppActions): Product | undefined => {
    switch (action.type) {
        case ActionTypes.SELECT_PRODUCT:
        case ActionTypes.LOAD_PRODUCT:
            return action.payload && typeof action.payload === 'object' ? { ...(action.payload as Product) } : undefined;
        case ActionTypes.DELETE_PRODUCT:
            if (state && typeof action.payload === 'string' && state.id === action.payload) {
                return undefined;
            }
            break;
    }

    return state;
}