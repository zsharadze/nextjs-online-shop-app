import { CategoryDTO } from "./categoryDTO";
import { PagerDTO } from "./pagerDTO";

export interface CategoriesDTO {
  categoriesList: CategoryDTO[];
  pager: PagerDTO;
}
