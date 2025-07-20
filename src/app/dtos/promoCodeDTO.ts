export interface PromoCodeDTO {
  _id?: string;
  promoCodeText: string;
  isUsed: boolean;
  createdDate: Date;
  discount: number;
  usedByUserEmail: string;
  usedOnOrderId: string;
}
