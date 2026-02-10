import { Dispatch } from "react";
import { Product } from "../models";
import { ProductService } from "../services/productService";
import { ActionTypes } from "./common";
import config from "../config"
import { ActionMethod, createPayloadAction, PayloadAction } from "./actionCreators";

export interface QueryOptions {
    [key: string]: RegExp | boolean
}

export interface ItemActions {
    list(options?: QueryOptions): Promise<Product[]>
    select(item?: Product): Promise<Product>
    load(id: string): Promise<Product>
    save(item: Product): Promise<Product>
    remove(item: Product): Promise<void>
}

export const list = (options?: QueryOptions): ActionMethod<Product[]> => async (dispatch: Dispatch<ListItemsAction>) => {
    const itemService = new ProductService(config.api.baseUrl, `/products`);
    const items = await itemService.getList(options);

    dispatch(listItemsAction(items));

    return items;
}

export const select = (item?: Product): ActionMethod<Product | undefined> => async (dispatch: Dispatch<SelectItemAction>) => {
    dispatch(selectItemAction(item));

    return Promise.resolve(item);
}

export const load = (id: string): ActionMethod<Product> => async (dispatch: Dispatch<LoadItemAction>) => {
    const itemService = new ProductService(config.api.baseUrl, `/products`);
    const item = await itemService.get(id);

    dispatch(loadItemAction(item));

    return item;
}

export const save = (item: Product): ActionMethod<Product> => async (dispatch: Dispatch<SaveItemAction>) => {
    const itemService = new ProductService(config.api.baseUrl, `/products`);
    const newItem = await itemService.save(item);

    dispatch(saveItemAction(newItem));

    return newItem;
}

export const remove = (item: Product): ActionMethod<void> => async (dispatch: Dispatch<DeleteItemAction>) => {
    const itemService = new ProductService(config.api.baseUrl, `/products`);
    if (item.id) {
        await itemService.delete(item.id);
        dispatch(deleteItemAction(item.id));
    }
}

export interface ListItemsAction extends PayloadAction<string, Product[]> {
    type: ActionTypes.LOAD_PRODUCTS
}

export interface SelectItemAction extends PayloadAction<string, Product | undefined> {
    type: ActionTypes.SELECT_PRODUCT
}

export interface LoadItemAction extends PayloadAction<string, Product> {
    type: ActionTypes.LOAD_PRODUCT
}

export interface SaveItemAction extends PayloadAction<string, Product> {
    type: ActionTypes.SAVE_PRODUCT
}

export interface DeleteItemAction extends PayloadAction<string, string> {
    type: ActionTypes.DELETE_PRODUCT
}

const listItemsAction = createPayloadAction<ListItemsAction>(ActionTypes.LOAD_PRODUCTS);
const selectItemAction = createPayloadAction<SelectItemAction>(ActionTypes.SELECT_PRODUCT);
const loadItemAction = createPayloadAction<LoadItemAction>(ActionTypes.LOAD_PRODUCT);
const saveItemAction = createPayloadAction<SaveItemAction>(ActionTypes.SAVE_PRODUCT);
const deleteItemAction = createPayloadAction<DeleteItemAction>(ActionTypes.DELETE_PRODUCT);
