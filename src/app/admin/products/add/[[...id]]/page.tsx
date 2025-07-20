"use client";
import { CategoryDTO } from "@/app/dtos/categoryDTO";
import { useEffect, useState } from "react";
import "./../../../../styles/admin-add-edit-product.css";
import { clearAllToasts, showToastError } from "@/app/helpers/toastService";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import useStore from "@/app/store/store";
import {
  addProduct,
  getProductByIdAdmin,
  updateProduct,
} from "@/app/services/products.service";
import { CreateProductDTO } from "@/app/dtos/createProductDTO";

export default function AddProduct() {
  const { categories, getCategories } = useStore();
  const router = useRouter();
  const params = useParams();
  const [maxAllowedImagesCount] = useState(5);
  const [addEditProduct, setAddEditProduct] = useState<CreateProductDTO>({
    id: null,
    name: "",
    description: "",
    price: null,
    category: "",
    imageName: "",
    mainImageIndex: 0,
    images: [],
  });
  const [imageFileUrls, setImageFileUrls] = useState<ImageFile[]>([]);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState<boolean>(false);
  const editId: any = params.id?.[0];

  useEffect(() => {
    getCategories(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (editId) {
        let productToEdit = await getProductByIdAdmin(editId);
        let mainImageIndex = 0;
        let images = productToEdit.images.map((img, index) => {
          if (productToEdit.imageName == img.imageName) mainImageIndex = index;
          return {
            id: img._id,
            imageName: img.imageName,
            imageUrl:
              process.env.NEXT_PUBLIC_IMGS_FOLDER!.toString() +
              "products/" +
              img.imageName,
          } as ImageFile;
        });
        setImageFileUrls(images);
        productToEdit.mainImageIndex = mainImageIndex;
        productToEdit.id = editId;
        setAddEditProduct(productToEdit);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    clearAllToasts();
    let allFieldsFilled = true;
    if (!(addEditProduct.name ?? null)) {
      showToastError("Please enter name");
      allFieldsFilled = false;
    }
    if (!(addEditProduct.description ?? null)) {
      showToastError("Please enter description");
      allFieldsFilled = false;
    }
    if (!(addEditProduct.price ?? null)) {
      showToastError("Please enter price");
      allFieldsFilled = false;
    }
    if (!(addEditProduct.category ?? null)) {
      showToastError("Please choose category");
      allFieldsFilled = false;
    }
    if (imageFileUrls.length === 0) {
      showToastError("Please upload images");
      allFieldsFilled = false;
    }

    if (!allFieldsFilled) return;

    setSaveBtnDisabled(true);
    if (!editId)
      await addProduct(
        { ...addEditProduct },
        imageFileUrls.map((img) => img.newlyAddedFile) as File[]
      );
    else {
      await updateProduct({ ...addEditProduct }, imageFileUrls);
    }

    router.push("/admin?tab=Products");
  };

  const onInputFileChange = (event: any) => {
    let fileCount = event.target.files && event.target.files.length;
    let files: File[] = event.target.files;

    if (imageFileUrls.length + fileCount <= maxAllowedImagesCount) {
      let i: number = 0;
      for (const singlefile of files) {
        let reader = new FileReader();
        reader.readAsDataURL(singlefile);
        i++;
        reader.onload = (event) => {
          const url = event?.target!.result as string;
          setImageFileUrls((imageFileUrlsArray) => [
            ...imageFileUrlsArray,
            {
              id: "",
              imageName: "",
              imageUrl: url,
              newlyAddedFile: singlefile,
            },
          ]);
        };
      }
    } else {
      showToastError("No More than 5 images allowed");
      event.target.value = null;
    }
  };
  const handleSetMainImageIndex = (index: number) => {
    setAddEditProduct({
      ...addEditProduct,
      mainImageIndex: index,
    });
  };

  const removeImage = (event: any, index: number) => {
    event.stopPropagation();

    if (
      index === addEditProduct.mainImageIndex ||
      imageFileUrls.length - 1 === addEditProduct.mainImageIndex ||
      index > imageFileUrls.length - 1
    ) {
      setAddEditProduct({
        ...addEditProduct,
        mainImageIndex: 0,
      });
    }
    let imageFileUrlsTmp = [...imageFileUrls];
    imageFileUrlsTmp.splice(index, 1);
    setImageFileUrls(imageFileUrlsTmp);
  };

  return (
    <>
      <i
        className="fa fa-arrow-circle-left ms-2 mt-2 float-start"
        aria-hidden="true"
        title="Go back"
        onClick={() => {
          router.push("/admin/?tab=Products");
        }}
      ></i>
      <h5 className="text-center mb-2 mt-2 fw-bold">
        {editId ? "Edit" : "Add"} Product
      </h5>
      <div className="container container-add-edit-products mt-2">
        <form className="poduct-form" onSubmit={handleSubmit} noValidate>
          <div className="mb-3 d-inline-block">
            <label htmlFor="productName" className="form-label">
              Product Name
            </label>
            <div className="form-group">
              <input
                type="text"
                className="form-control input-add-edit-product"
                placeholder="Enter product name"
                required
                value={addEditProduct.name?.toString()}
                onChange={(e) => {
                  setAddEditProduct({
                    ...addEditProduct,
                    name: e.target.value,
                  });
                }}
              />
              <span
                className="text-danger validation-span"
                title="Name field required"
              >
                *
              </span>
            </div>
            <div className="mt-3 mb-3">
              <label htmlFor="productPrice" className="form-label">
                Product Price
              </label>
              <div className="form-group">
                <input
                  type="number"
                  className="form-control input-add-edit-product"
                  step="0.01"
                  placeholder="Enter product price"
                  required
                  defaultValue={addEditProduct.price?.toString()}
                  onChange={(e) => {
                    setAddEditProduct({
                      ...addEditProduct,
                      price: Number(e.target.value),
                    });
                  }}
                />
                <span
                  className="text-danger validation-span"
                  title="Price field required"
                >
                  *
                </span>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="productCategory" className="form-label">
                Product Category
              </label>
              <div className="form-group">
                <select
                  className="form-select select-add-edit-product"
                  required
                  value={addEditProduct.category}
                  onChange={(e) => {
                    setAddEditProduct({
                      ...addEditProduct,
                      category: e.target.value,
                    });
                  }}
                >
                  <option value="">Select a category</option>
                  {categories?.categoriesList.map((category: CategoryDTO) => (
                    <option key={category._id} value={category._id?.toString()}>
                      {category.name}
                    </option>
                  ))}
                  <option></option>
                </select>
                <span
                  className="text-danger validation-span"
                  title="Category field required"
                >
                  *
                </span>
              </div>
            </div>
          </div>
          <div
            className="mb-3 d-inline-block ms-3"
            style={{ verticalAlign: "top" }}
          >
            <label htmlFor="productDescription" className="form-label">
              Product Description
            </label>
            <div className="form-group">
              <textarea
                className="form-control textarea-add-edit-product"
                rows={4}
                placeholder="Enter product description"
                required
                value={addEditProduct.description?.toString()}
                onChange={(e) => {
                  setAddEditProduct({
                    ...addEditProduct,
                    description: e.target.value,
                  });
                }}
              ></textarea>
              <span
                className="text-danger validation-span"
                title="Description field required"
              >
                *
              </span>
            </div>
            <div className="imageFileWrapper">
              <label className="form-label">Product Image: </label>
              <div className="form-group">
                <input
                  type="file"
                  className="form-control ms-1 input-add-edit-product"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    onInputFileChange(e);
                  }}
                />
              </div>
            </div>
          </div>
          {imageFileUrls?.map((imageFileUrl, index) => (
            <div key={index} className="previewImageWrapper mb-2">
              <div className="form-check me-3">
                <input
                  id={"imgMainRadio_" + index}
                  type="radio"
                  name="imgMainRadio"
                  checked={index === addEditProduct.mainImageIndex}
                  className="form-check-input input-add-edit-product"
                  onClick={() => handleSetMainImageIndex(index)}
                  onChange={() => {}}
                />
                <label
                  className="form-check-label"
                  htmlFor={"imgMainRadio_" + index}
                >
                  Main
                </label>
              </div>
              <div
                className={
                  (index === addEditProduct.mainImageIndex
                    ? "border-success border-2"
                    : "border-dark") + " previewImageWrapper border me-1"
                }
                onClick={() => {
                  handleSetMainImageIndex(index);
                }}
              >
                <span
                  className="close-btn"
                  onClick={(e) => removeImage(e, index)}
                >
                  &times;
                </span>
                <img
                  src={imageFileUrl.imageUrl}
                  alt={"Product image " + index}
                  className="img-add-edit-product"
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={saveBtnDisabled}
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
