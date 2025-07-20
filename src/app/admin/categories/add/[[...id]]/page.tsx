"use client";
import { useEffect, useRef, useState } from "react";
import "./../../../../styles/admin-add-edit-category.css";
import { showToastError } from "@/app/helpers/toastService";
import {
  addCategory,
  getCategoryById,
  updateCategory,
} from "@/app/services/categories.service";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { CreateCategoryDTO } from "@/app/dtos/createCategoryDTO";

export default function AddCategory() {
  const [preview, setPreview] = useState<string>();
  const [addEditCategory, setAddEditCategory] = useState<CreateCategoryDTO>({
    _id: null,
    name: "",
    imageName: "",
    imageFile: null,
  });

  const [saveBtnDisabled, setSaveBtnDisabled] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const editId: any = params.id?.[0];

  useEffect(() => {
    const fetchData = async () => {
      if (editId) {
        let categoryObj = await getCategoryById(editId);
        setAddEditCategory(categoryObj);

        setPreview(
          process.env.NEXT_PUBLIC_IMGS_FOLDER!.toString() +
            "categories/" +
            categoryObj.imageName
        );
      }
    };

    fetchData();
  }, []);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAddEditCategory((category) => ({
        ...category,
        imageFile: null,
      }));
      return;
    }

    const fileSizeInMB = Math.round(e.target.files[0].size / (1024 * 1024));
    if (fileSizeInMB > 3) {
      showToastError("Image file size must be less than 3mb");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setAddEditCategory((category) => ({
      ...category,
      imageFile: e.target.files[0],
    }));

    setPreview(URL.createObjectURL(e.target.files[0]));
  };
  const handleSave = async () => {
    if (!addEditCategory.name) {
      showToastError("Please enter category name");
      return;
    } else if (!addEditCategory.imageFile && !addEditCategory.imageName) {
      showToastError("Please upload image");
      return;
    }
    setSaveBtnDisabled(true);
    if (!editId) await addCategory(addEditCategory);
    else await updateCategory(addEditCategory);
    router.push("/admin?tab=Categories");
  };
  return (
    <>
      <i
        className="fa fa-arrow-circle-left ms-2 mt-2 float-start"
        aria-hidden="true"
        title="Go back"
        onClick={() => {
          router.push("/admin?tab=Categories");
        }}
      ></i>
      <div className="d-flex flex-row justify-content-center align-items-center">
        <form>
          <h5 className="text-center mt-2 mb-2 fw-bold">
            {addEditCategory?._id ? "Edit" : "Add"} Category
          </h5>
          <div className="mb-3">
            <label className="form-label">Category name</label>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter category name"
                value={addEditCategory.name}
                onChange={(e) => {
                  setAddEditCategory((category) => ({
                    ...category,
                    name: e.target.value,
                  }));
                }}
              />
              <span
                className="text-danger validation-span"
                title="Category name field required"
              >
                *
              </span>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <div className="form-group">
              <input
                type="file"
                className="form-control shadow-none"
                id="image"
                name="image"
                accept="image/*"
                ref={fileInputRef}
                onChange={onSelectFile}
              />
            </div>
          </div>
          <div className="form-group text-center mt-1 mb-2">
            {preview && (
              <img
                className="category-image"
                alt="Category image"
                src={preview}
              />
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleSave}
            disabled={saveBtnDisabled}
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
