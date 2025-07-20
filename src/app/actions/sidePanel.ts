"use server";
import { getAllCategories } from "@/app/services/categories.service";
import { seeder } from "@/app/data/seeder/seeder";
import { CategoryDTO } from "../dtos/categoryDTO";
import { FilterCategories } from "../dtos/filters/filter-categories";
import { CategoriesDTO } from "../dtos/categoriesDTO";

export async function getAllCategoriesAndSeedData() {
  try {
    await seeder.start();
    const categories: CategoriesDTO = await getAllCategories({} as FilterCategories);

    return JSON.parse(JSON.stringify(categories.categoriesList));
  } catch (error: any) {
    console.log("error", error);
  }
}
