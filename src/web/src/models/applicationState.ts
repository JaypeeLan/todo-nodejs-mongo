import { AppActions } from "../actions/common";
import { Product } from "./product";
import { Dispatch } from "react";

export interface AppContext {
    state: ApplicationState
    dispatch: Dispatch<AppActions>
}

export interface ApplicationState {
    products?: Product[]
    selectedItem?: Product
}

export const getDefaultState = (): ApplicationState => {
    return {
        products: [],
        selectedItem: undefined
    }
}
