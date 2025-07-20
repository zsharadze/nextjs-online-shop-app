import { CategoryDTO } from "@/app/dtos/categoryDTO";

export const setProductCountOnCategoryObject = (
  categoryDTO: CategoryDTO,
  productCount: number
) => {
  return {
    ...categoryDTO,
    _id: categoryDTO._id,
    name: categoryDTO.name,
    imageName: categoryDTO.imageName,
    productsCount: productCount,
  };
};
