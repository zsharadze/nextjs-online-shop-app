import { OrderDTO } from "./orderDTO";
import { PagerDTO } from "./pagerDTO";

export interface OrdersDTO {
  orderList: OrderDTO[];
  pager: PagerDTO;
}
