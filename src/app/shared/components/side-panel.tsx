"use client";
import { getAllCategoriesAndSeedData } from "@/app/actions/sidePanel";
import "./../../styles/side-panel.css";
import { CategoryDTO } from "@/app/dtos/categoryDTO";
import { useEffect, useState } from "react";

export const SidePanel = ({ categoryChanged }: any) => {
  const [categories, setCategories] = useState<CategoryDTO[]>();

  useEffect(() => {
    getAllCategoriesAndSeedData().then((res) => {
      setCategories(res);
    });
  }, []);

  return (
    <aside className="side-panel">
      <h4
        className="item growMainCategoryImgAndText"
        style={{ cursor: "pointer" }}
        onClick={() => {
          categoryChanged(null);
        }}
      >
        Categories
      </h4>
      <ul>
        {categories?.map((category, index) => (
          <li
            key={index}
            className="item growMainCategoryImgAndText"
            role="button"
            onClick={() => {
              categoryChanged(category._id);
            }}
          >
            <img
              src={"/imgs/categories/" + category.imageName}
              className="menuImage"
              alt="category image"
            />
            <span className="ms-3 no-label-select">{category.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};
