"use client";
import { useRouter } from "next/navigation";
import "./../../styles/product-details.css";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import useStore from "@/app/store/store";
import { useParams } from "next/navigation";
import { showToastSuccess } from "@/app/helpers/toastService";

function ProductDetails() {
  const { product, getProduct, addToShoppingCart } = useStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const router = useRouter();

  const showPreviousImage = () => {
    let ind = 0; //we need this variable here because selectedImageIndex update is async
    if (selectedImageIndex - 1 < 0) {
      setSelectedImageIndex(ind);
    } else {
      ind = selectedImageIndex - 1;
      setSelectedImageIndex(ind);
    }

    let newSrc: string =
      process.env.NEXT_PUBLIC_IMGS_FOLDER!.toString() +
      "products/" +
      product?.images[ind].imageName;
    imageChangeAnimate(newSrc);
  };
  const showNextImage = () => {
    let ind = 0; //we need this variable here because selectedImageIndex update is async
    if (selectedImageIndex + 1 >= product?.images!?.length) {
      setSelectedImageIndex(ind);
    } else {
      ind = selectedImageIndex + 1;
      setSelectedImageIndex(ind);
    }
    let newSrc: string =
      process.env.NEXT_PUBLIC_IMGS_FOLDER!.toString() +
      "products/" +
      product?.images[ind].imageName;

    imageChangeAnimate(newSrc);
  };
  const imageChangeAnimate = (src: string) => {
    let img: any = document.getElementById("image");
    img.classList.remove("show");
    img.classList.add("fade");
    setTimeout(function () {
      img.src = src;
      img.classList.remove("fade");
      img.classList.add("show");
    }, 100);
  };
  const handleAddToCart = async () => {
    const cartObject = {
      productId: product?._id!,
      name: product?.name!,
      description: product?.description!,
      quantity: quantity,
      imageName: product?.imageName!,
      unitPrice: product?.price!,
      totalPrice: quantity * product?.price!,
    };
    await addToShoppingCart({ ...cartObject });
    showToastSuccess("Product added to shopping cart");
  };
  const params = useParams();
  const id: any = params.id?.[0];

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await getProduct(id);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    //set main image index
    let mainImageIndex = product?.images.findIndex(
      (x) => x.imageName == product.imageName
    );
    setSelectedImageIndex(mainImageIndex!);
    let imageSrc =
      process.env.NEXT_PUBLIC_IMGS_FOLDER!.toString() +
      "products/" +
      product?.imageName;
    imageChangeAnimate(imageSrc);
  }, [product]);

  return (
    <>
      <i
        className="fa fa-arrow-circle-left ms-2 mt-1"
        aria-hidden="true"
        title="Go back"
        onClick={() => {
          router.push("/");
        }}
      ></i>
      <div className="container container-product-details">
        <main className="main-content main-content-product-details mt-3">
          <div className="product-image position-relative align-items-center justify-content-center">
            <img id="image" alt="Product image" />
            <button
              className="btn btn-secondary position-absolute top-50 start-0 translate-middle-y image-previous-btn ms-3"
              style={{ zIndex: "1" }}
              onClick={showPreviousImage}
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
            <button
              className="btn btn-secondary position-absolute top-50 end-0 translate-middle-y image-next-btn me-3"
              style={{ zIndex: "1" }}
              onClick={showNextImage}
            >
              <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
          <div className="product-details-product">
            <h1 className="product-title fw-bold">{product?.name}</h1>
            <p className="product-price">${product?.price}</p>
            <p className="product-description">{product?.description}</p>
            <div className="product-attributes-product">
              <h5>More:</h5>
              <ul>
                <li>Category: {product?.categoryName}</li>
                <li>
                  Added date:
                  {product?.createdDate &&
                    format(product?.createdDate, "dd-MM-yyyy")}
                </li>
                <li>Total sold: {product?.ordersCount}</li>
              </ul>
            </div>
            <div className="d-flex align-items-center mb-4">
              <label htmlFor="quantity" className="me-2">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                className="form-control w-25 me-2"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart()}
            >
              Add to Cart <i className="fa fa-cart-plus" aria-hidden="true"></i>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default ProductDetails;
