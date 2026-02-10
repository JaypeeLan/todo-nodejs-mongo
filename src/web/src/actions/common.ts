import * as itemActions from './itemActions';

export enum ActionTypes {
    LOAD_PRODUCTS = "LOAD_PRODUCTS",
    LOAD_PRODUCT = "LOAD_PRODUCT",
    SELECT_PRODUCT = "SELECT_PRODUCT",
    SAVE_PRODUCT = "SAVE_PRODUCT",
    DELETE_PRODUCT = "DELETE_PRODUCT"
}

export type AppActions =
    itemActions.ListItemsAction |
    itemActions.SelectItemAction |
    itemActions.LoadItemAction |
    itemActions.SaveItemAction |
    itemActions.DeleteItemAction;