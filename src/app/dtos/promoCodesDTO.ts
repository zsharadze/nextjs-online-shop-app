import { PagerDTO } from "./pagerDTO";
import { PromoCodeDTO } from "./promoCodeDTO";

export interface PromoCodesDTO {
  promoCodeList: PromoCodeDTO[];
  pager: PagerDTO;
}
