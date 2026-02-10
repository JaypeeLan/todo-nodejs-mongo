import { Product } from "./todoItem";

export interface TodoList {
    id?: string
    name: string
    items?: Product[]
    description?: string
    createdDate?: Date
    updatedDate?: Date
}