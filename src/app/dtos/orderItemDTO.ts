import { ProductDTO } from "./productDTO";

export interface OrderItemDTO {
  quantity: number;
  productId: number;
  product: ProductDTO;
}
