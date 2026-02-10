import { AppActions } from "../actions/common";
import { productsReducer } from "./productsReducer";
import { selectedItemReducer } from "./selectedItemReducer";
import { Reducer } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const combineReducers = (slices: { [key: string]: Reducer<any, AppActions> }) => (prevState: any, action: AppActions) =>
    Object.keys(slices).reduce(
        (nextState, nextProp) => ({
            ...nextState,
            [nextProp]: slices[nextProp](prevState[nextProp], action)
        }),
        prevState
    );

export default combineReducers({
    products: productsReducer,
    selectedItem: selectedItemReducer,
});
