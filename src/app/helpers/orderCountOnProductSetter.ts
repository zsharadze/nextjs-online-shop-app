import { ProductDTO } from "../dtos/productDTO";

export const setOrderCountOnProductObject = (
  productDTO: ProductDTO,
  orderCount: number
): ProductDTO => {
  return {
    ...productDTO,
    _id: productDTO._id,
    name: productDTO.name,
    imageName: productDTO.imageName,
    category: productDTO.category,
    categoryName: productDTO.categoryName,
    createdDate: productDTO.createdDate,
    description: productDTO.description,
    price: productDTO.price,
    ordersCount: orderCount,
  };
};
