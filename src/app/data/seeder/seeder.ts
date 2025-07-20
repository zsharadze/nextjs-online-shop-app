import {dbConnect} from "../connectMongo";
import { ProductDTO } from "../../dtos/productDTO";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";
import { initialCategories, initialProducts } from "./seeder-data";
import { ProductImage } from "../models/product-image.model";

class Seeder {
  private static instance: Seeder;
  private started = false;

  async start() {
    if (!this.started) {
      this.started = true;
      await dbConnect();
      let categories = await Category.findOne({});
      if (!categories) {
        console.log("categories is empty in db. seeding categories");
        await Category.insertMany(initialCategories);
        console.log("seeding categories ended");
      }
      let products = await Product.findOne({});
      if (!products) {
        console.log("products is empty in db. seeding products");
        let categoryDesktops = await Category.findOne({ name: "Desktops" });
        let categoryLaptops = await Category.findOne({ name: "Laptops" });
        let categoryTablets = await Category.findOne({ name: "Tablets" });
        
        let insertProductsArray = initialProducts.map((product: ProductDTO) => {
          let productInsertObject = new Product();
          productInsertObject.name = product.name;
          productInsertObject.description = product.description;
          productInsertObject.imageName = product.imageName;
          productInsertObject.price = product.price;
          productInsertObject.images = [];
          if (product.categoryName == "Desktops")
            productInsertObject.category = categoryDesktops._id;
          if (product.categoryName == "Laptops")
            productInsertObject.category = categoryLaptops._id;
          if (product.categoryName == "Tablets")
            productInsertObject.category = categoryTablets._id;
          return productInsertObject;
        });

        for (let k = 0; k < insertProductsArray.length; k++) {
          const element = insertProductsArray[k];
          let image = await ProductImage.create({
            imageName: element.imageName, 
          });
          element.images.push(image._id);
        }

        await Product.insertMany(insertProductsArray);

        console.log("seeding products ended");
      }
    }
  }

  public static getInstance(): Seeder {
    if (!Seeder.instance) {
      Seeder.instance = new Seeder();
    }
    return Seeder.instance;
  }
}

export const seeder = Seeder.getInstance();
