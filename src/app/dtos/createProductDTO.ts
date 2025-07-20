export interface CreateProductDTO {
  id: number | null;
  name: string;
  description: string;
  imageName: string;
  price: number | null;
  category: string;
  mainImageIndex: number;
  images: any[];
}
