export interface CreateOrderDTO {
  orderItemList: CreateOrderItem[];
  promoCode: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
}
