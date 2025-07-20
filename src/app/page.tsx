"use client";
import { SidePanel } from "./shared/components/side-panel";
import { useEffect, useState } from "react";
import { Pagination } from "./shared/components/pagination";
import useStore from "@/app/store/store";
import { FilterProducts } from "./dtos/filters/filter-products";
import { showToastSuccess } from "@/app/helpers/toastService";
import "./styles/main-page.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const { products, getProducts, addToShoppingCart } = useStore();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterProducts>({
    pageIndex: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getProducts(filter);
  }, [filter]);

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({ pageIndex: pageIndex, pageSize: 10 });
  };

  const handleCategoryChanged = (id: number) => {
    setFilter({ ...filter, categoryId: id, pageIndex: 1 });
  };

  return (
    <>
      <div id="container" className="container">
        <SidePanel categoryChanged={handleCategoryChanged} />
        <main id="main-content" className="main-content">
          <div className="product-grid">
            {products?.productList?.map((product) => (
              <div key={product._id} className="product product-card">
                <img
                  role="button"
                  src={"/imgs/products/" + product.imageName}
                  alt="product image"
                  onClick={() => router.push("/productdetails/" + product._id)}
                />
                <h3 role="button" onClick={() => router.push("/productdetails/" + product._id)}>{product.name}</h3>
                <p className="text-description" role="button" onClick={() => router.push("/productdetails/" + product._id)}>
                  {product.description}
                </p>
                <h5
                  className="text-success"
                  onClick={() => router.push("/productdetails/" + product._id)}
                >
                  {product.price} $
                </h5>
                <button
                  className="add-to-cart-button w-100"
                  onClick={async () => {
                    await addToShoppingCart({
                      productId: product._id!,
                      name: product.name!,
                      description: product.description!,
                      quantity: 1,
                      imageName: product.imageName!,
                      unitPrice: product?.price!,
                      totalPrice: 1 * product?.price!,
                    });
                    showToastSuccess("Product added to shopping cart");
                  }}
                >
                  Add to Cart{" "}
                  <i className="fa fa-cart-plus" aria-hidden="true"></i>
                </button>
              </div>
            ))}
          </div>
          <Pagination
            pagerParam={products?.pager}
            pageChanged={handlePageIndexChanged}
          ></Pagination>
          <span className="fst-italic ms-3">
            {products?.pager.paginationSummary}
          </span>
        </main>
      </div>
    </>
  );
}
