import { PagerDTO } from "./pagerDTO";
import { ProductDTO } from "./productDTO";

export interface ProductsDTO {
  productList: ProductDTO[];
  pager: PagerDTO;
}
