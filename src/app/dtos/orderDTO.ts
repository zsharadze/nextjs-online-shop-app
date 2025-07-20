import { OrderItemDTO } from "./orderItemDTO";
import { PromoCodeDTO } from "./promoCodeDTO";

export interface OrderDTO {
  _id?: string;
  createdDate: Date;
  status: string;
  subtotal: number;
  userId: string;
  subtotalWithPromo: number;
  promoCode: PromoCodeDTO;
  orderItems: OrderItemDTO[];
}
