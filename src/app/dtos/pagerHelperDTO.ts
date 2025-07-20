import { PagerDTO } from "./pagerDTO";

export interface PagerHelperDTO {
  pager: PagerDTO;
  currentPage: number;
  pageSize: number;
}
