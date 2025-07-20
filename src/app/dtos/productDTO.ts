import { CategoryDTO } from "./categoryDTO";

export interface ProductDTO {
  _id?: string;
  name: string;
  category: CategoryDTO | null;
  categoryName: string;
  createdDate: Date | null;
  description: string;
  price: number;
  ordersCount: number | null;
  imageName: string;
  images: ProductImageDTO[];
}

export interface ProductImageDTO {
  _id?: string;
  imageName: string;
}