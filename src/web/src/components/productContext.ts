import { AppContext, getDefaultState } from "../models/applicationState";
import { createContext } from "react";

const initialState = getDefaultState();
const dispatch = () => { return };

export const ProductContext = createContext<AppContext>({ state: initialState, dispatch: dispatch });