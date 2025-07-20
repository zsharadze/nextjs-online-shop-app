"use server";
import { FilterProducts } from "@/app/dtos/filters/filter-products";
import { ProductsDTO } from "@/app/dtos/productsDTO";
import {
  dbConnect,
  dbConnectWithCheckUserPermissionAdmin,
} from "@/app/data/connectMongo";
import { Product } from "@/app/data/models/product.model";
import { pagerHelper } from "./../utils/pager";
import { OrderItem } from "../data/models/order-item.model";
import { setOrderCountOnProductObject } from "../helpers/orderCountOnProductSetter";
import { getFileExtension } from "../helpers/fileExtensionGetter";
import { v4 as uuidv4 } from "uuid";
import { CreateProductDTO } from "../dtos/createProductDTO";
import { writeFile } from "fs/promises";
import path from "path";
import { ProductImage } from "../data/models/product-image.model";
import fs from "fs";
import { ProductDTO } from "../dtos/productDTO";

export const getAllProducts = async (
  filter: FilterProducts
): Promise<ProductsDTO> => {
  try {
    await dbConnect();
    let summaryTextAdd = "";
    let query = {};
    if (filter.categoryId || filter.searchText) {
      summaryTextAdd = ` (filtered from ${await Product.countDocuments(
        {}
      )} total entries)`;
    }
    if (filter.categoryId) {
      query = { category: filter.categoryId };
    }
    if (filter.searchText) {
      const regex = new RegExp(filter.searchText, "i"); // i for case insensitive
      query = {
        ...query,
        $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }],
      };
    }

    let totalCount = await Product.countDocuments(query);
    let pagerHelperObject = await pagerHelper(
      totalCount,
      filter.pageIndex,
      filter.pageSize,
      summaryTextAdd
    );

    let result: ProductsDTO = {
      pager: pagerHelperObject.pager,
      productList: await Product.find(query)
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .populate("category"),
    };

    if (filter.getOrdersCount) {
      let ordersItemsOnProducts = await OrderItem.find({
        product: {
          $in: result.productList.map((x) => x._id?.toString()),
        },
      });

      for (let k = 0; k < result.productList.length; k++) {
        let orderItem = ordersItemsOnProducts.filter(
          (x) => x.product == result.productList[k]._id?.toString()
        );
        result.productList[k] = setOrderCountOnProductObject(
          result.productList[k],
          orderItem.length
        );
      }
    }
    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getProductByIdAdmin = async (
  id: string
): Promise<CreateProductDTO> => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();

    let product = await Product.findById(id).populate("images");
    if (product) return JSON.parse(JSON.stringify(product));
    else {
      throw new Error("product with id " + id + " not found");
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getProductByIdDetails = async (
  id: string
): Promise<ProductDTO> => {
  try {
    await dbConnect();

    let product = await Product.findById(id)
      .populate("category")
      .populate("images");
    let orderItemsCount = await OrderItem.countDocuments({
      product: id,
    });

    //map product object
    let returnValue: ProductDTO = {
      _id: product._id.toString(),
      name: product.name,
      categoryName: product.category.name,
      createdDate: product.createdDate,
      description: product.description,
      imageName: product.imageName,
      price: product.price,
      category: null,
      ordersCount: orderItemsCount,
      images: product.images.map((img: any) => {
        return {
          _id: img._id.toString(),
          imageName: img.imageName,
        };
      }),
    };
    if (returnValue) return JSON.parse(JSON.stringify(returnValue));
    else {
      throw new Error("product with id " + id + " not found");
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const addProduct = async (
  productData: CreateProductDTO,
  images: File[]
) => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();

    let imageNames: string[] = [];
    for (let k = 0; k < images.length; k++) {
      const fileName = (images[k] as any).name;
      let imageName = uuidv4() + "." + getFileExtension(fileName);
      const buffer = Buffer.from(await images[k].arrayBuffer());

      await writeFile(
        path.join(process.cwd(), `public/imgs/${"products"}/`, imageName),
        buffer
      );
      imageNames.push(imageName);
    }

    let productImages = imageNames.map((item) => {
      return {
        imageName: item,
      };
    });

    let savedProductImages = await ProductImage.insertMany(productImages);

    const newProduct = {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      imageName: imageNames[productData.mainImageIndex],
      images: savedProductImages.map((x) => x._id),
    };

    await Product.create(newProduct);
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const updateProduct = async (
  productData: CreateProductDTO,
  images: ImageFile[]
) => {
  await dbConnectWithCheckUserPermissionAdmin();

  try {
    let productExisting = await Product.findById(productData.id).populate(
      "images"
    );
    if (productExisting) {
    } else {
      throw new Error("product with id " + productData.id + " not found");
    }

    let imageNames: any[] = [];
    for (let k = 0; k < images.length; k++) {
      const file = images[k].newlyAddedFile;
      if (file) {
        const fileName = file?.name;
        let imageName = uuidv4() + "." + getFileExtension(fileName!);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(
          path.join(process.cwd(), `public/imgs/${"products"}/`, imageName),
          buffer
        );
        imageNames.push({
          id: 0,
          index: k,
          imageName: imageName,
          newFile: true,
        });
      } else {
        imageNames.push({
          id: images[k].id,
          index: k,
          imageName: images[k].imageName,
          newFile: false,
        });
      }
    }

    let newProductImages = imageNames
      .filter((x) => x.newFile)
      .map((item) => {
        return {
          imageName: item.imageName,
        };
      });

    let deletedImagesIds: string[] = [];
    let existingImagesIds = productExisting.images.map((x: any) =>
      x._id.toString()
    ) as string[];
    
    //add deleted image ids to deletedImagesIds to delete deleted images that user removed on product edit page
    for (let i = 0; i < existingImagesIds.length; i++) {
      const elementId = existingImagesIds[i];
      if (!images.find((x) => x.id == elementId)) {
        deletedImagesIds.push(elementId);
      }
    }

    let deletedImages = await ProductImage.find({
      _id: { $in: deletedImagesIds },
    });
   
    //delete deleted images from disk
    for (let k = 0; k < deletedImages.length; k++) {
      const imageIName = deletedImages[k].imageName;
      const absolutePath = path.join(
        process.cwd(),
        "public/imgs/products",
        imageIName
      );

      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          throw err;
        }
      });
    }

    await ProductImage.deleteMany({ _id: { $in: deletedImagesIds } });
    let savedProductImages = await ProductImage.insertMany(newProductImages);
    for (let c = 0; c < imageNames.length; c++) {
      if (c === productData.mainImageIndex) {
        productData.imageName = imageNames[c].imageName;
      }
    }

    let updateObj = {
      name: productData.name,
      description: productData.description,
      imageName: productData.imageName,
      price: productData.price,
      category: productData.category,
      images: [
        //update product images with new image ids
        ...imageNames.filter((x) => !x.newFile).map((m) => m.id),
        ...savedProductImages.map((m2) => m2._id.toString()),
      ],
    };

    await Product.findByIdAndUpdate(productData.id, updateObj);
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  await dbConnectWithCheckUserPermissionAdmin();

  try {
    let productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return "product with id " + id + " does not exist";
    }
    let orderItemsCountWithProduct = await OrderItem.countDocuments({
      product: id,
    });

    if (orderItemsCountWithProduct > 0) {
      return "Can't delete product because there are orders attached to it.";
    }

    let productImages = await ProductImage.find({
      _id: { $in: productToDelete.images.map((img: any) => img.toString()) },
    });

    for (let k = 0; k < productImages.length; k++) {
      const imageIName = productImages[k].imageName;
      const absolutePath = path.join(
        process.cwd(),
        "public/imgs/products",
        imageIName
      );

      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          throw err;
        }
      });
    }
    await ProductImage.deleteMany({
      _id: { $in: productImages.map((img) => img._id.toString()) },
    });

    await Product.deleteOne({ _id: id });
    return "";
  } catch (error: any) {
    console.log("error", error);
  }
};
