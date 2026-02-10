import { RestService } from './restService';
import { Product } from '../models';

export class ProductService extends RestService<Product> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }
}
