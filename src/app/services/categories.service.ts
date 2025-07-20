"use server";
import {
  dbConnect,
  dbConnectWithCheckUserPermissionAdmin,
} from "@/app/data/connectMongo";
import { Category } from "@/app/data/models/category.model";
import { Product } from "@/app/data/models/product.model";
import { CategoriesDTO } from "@/app/dtos/categoriesDTO";
import { FilterCategories } from "@/app/dtos/filters/filter-categories";
import { getFileExtension } from "@/app/helpers/fileExtensionGetter";
import { setProductCountOnCategoryObject } from "@/app/helpers/productCountOnCategorySetter";
import { pagerHelper } from "./../utils/pager";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";

export const getAllCategories = async (
  filter: FilterCategories
): Promise<CategoriesDTO> => {
  try {
    await dbConnect();
    let summaryTextAdd = "";
    let query = {};
    if (filter?.searchText) {
      summaryTextAdd = ` (filtered from ${await Category.countDocuments(
        {}
      )} total entries)`;
    }

    if (filter?.searchText) {
      const regex = new RegExp(filter.searchText, "i"); // i for case insensitive
      query = {
        ...query,
        name: { $regex: regex },
      };
    }

    let totalCount = await Category.countDocuments(query);
    let pagerHelperObject = await pagerHelper(
      totalCount,
      filter.pageIndex,
      filter.pageSize,
      summaryTextAdd
    );

    if (filter) {
      let resultWithPaging: CategoriesDTO = {
        pager: pagerHelperObject.pager,
        categoriesList: await Category.find(query)
          .skip((filter.pageIndex - 1) * filter.pageSize)
          .limit(filter.pageSize),
      };

      for (let k = 0; k < resultWithPaging.categoriesList.length; k++) {
        let productCount = await Product.countDocuments({
          category: resultWithPaging.categoriesList[k]._id,
        });
        resultWithPaging.categoriesList[k] = setProductCountOnCategoryObject(
          resultWithPaging.categoriesList[k],
          productCount
        );
      }
      return JSON.parse(JSON.stringify(resultWithPaging));
    } else {
      let result: CategoriesDTO = {
        pager: pagerHelperObject.pager,
        categoriesList: await Category.find(),
      };

      return JSON.parse(JSON.stringify(result));
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getCategoryById = async (
  id: string
): Promise<CreateCategoryDTO> => {
  try {
    await dbConnect();

    let category = await Category.findById(id);
    if (category) return JSON.parse(JSON.stringify(category));
    else {
      throw new Error("category with id " + id + " not found");
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const addCategory = async (categoryData: CreateCategoryDTO) => {
  try {
    await dbConnectWithCheckUserPermissionAdmin()
    const fileName = (categoryData.imageFile as any).name;
    let imageName = uuidv4() + "." + getFileExtension(fileName);
    const buffer = Buffer.from(await categoryData.imageFile!.arrayBuffer());

    try {
      await writeFile(
        path.join(process.cwd(), `public/imgs/${"categories"}/`, imageName),
        buffer
      );
    } catch (error) {
      console.log("Error occured ", error);
    }

    await Category.create({
      name: categoryData.name,
      imageName: imageName,
    });
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const updateCategory = async (categoryData: CreateCategoryDTO) => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();
    const imageFile = categoryData.imageFile as any;
    let oldImageName = categoryData.imageName;
    let newImageName = "";
    if (imageFile) {
      newImageName = uuidv4() + "." + getFileExtension(imageFile.name);
      categoryData.imageName = newImageName;

      const buffer = Buffer.from(await categoryData.imageFile!.arrayBuffer());
      await writeFile(
        path.join(process.cwd(), `public/imgs/${"categories"}/`, newImageName),
        buffer
      );
    }
    await Category.findByIdAndUpdate(categoryData._id, {
      name: categoryData.name,
      imageName: imageFile ? newImageName : oldImageName,
    });

    //if image has changed delete old one
    if (newImageName) {
      const absolutePath = path.join(
        process.cwd(),
        "public/imgs/categories",
        oldImageName
      );

      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          throw err;
        }
      });
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();
    let categoryToDelete = await Category.findById(id);

    if (!categoryToDelete) {
      return "category with id " + id + " does not exist";
    }
    let productCountWithCurrentCategory = await Product.countDocuments({
      category: id,
    });

    if (productCountWithCurrentCategory > 0) {
      return "Can't delete category because there are products attached to it.";
    }

    const absolutePath = path.join(
      process.cwd(),
      "public/imgs/categories",
      categoryToDelete.imageName
    );

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        throw err;
      }
    });

    await Category.deleteOne({ _id: id });
    return "";
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};
