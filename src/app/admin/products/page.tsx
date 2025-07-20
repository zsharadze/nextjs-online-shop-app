"use client";
import { useRouter } from "next/navigation";
import "../../styles/admin-products.css";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "@/app/shared/components/pagination";
import useStore from "@/app/store/store";
import { useDebounce } from "@/app/helpers/useDebounce";
import { ModalDialog } from "@/app/shared/components/modal-dialog";
import { format } from "date-fns";
import { FilterProducts } from "@/app/dtos/filters/filter-products";
import { deleteProduct } from "@/app/services/products.service";
import { showToastError } from "@/app/helpers/toastService";

export default function AdminProducts() {
  const { products, getProducts } = useStore();
  const [filter, setFilter] = useState<FilterProducts>({
    pageIndex: 1,
    pageSize: 10,
    getOrdersCount: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const deleteProductId = useRef("");
  const [modalParams, setModalParams] = useState({
    title: "Delete",
    message: "Are you sure to delete?",
    hasOkButton: false,
    okButtonClass: "btn-danger",
    hasYesButton: true,
    yesButtonClass: "btn-success",
    hasNoButton: true,
    noButtonClass: "btn-danger",
    showModal: false,
    onOkButtonClick: null,
    onYesButtonClick: {},
    onNoButtonClick: {},
  });

  useEffect(() => {
    getProducts(filter);
  }, [filter]);

  useEffect(() => {
    search();
  }, [debouncedSearchTerm]);

  const search = () => {
     setFilter({
      ...filter,
      searchText: debouncedSearchTerm,
    });
  };

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({
      ...filter,
      pageIndex: pageIndex,
    });
  };

const handleClickDelete = (id: string) => {
    deleteProductId.current = id;
    setModalParams({
      ...modalParams,
      showModal: true,
      onNoButtonClick: onCloseConfirmDeleteModal,
      onYesButtonClick: handleDeleteProduct,
    });
  };

  const onCloseConfirmDeleteModal = () => {
    setModalParams({ ...modalParams, showModal: false });
  };

  const handleDeleteProduct = async () => {
    setModalParams({ ...modalParams, showModal: false });
    let error = await deleteProduct(deleteProductId.current);
    if (error) {
      showToastError(error);
      return;
    }
    getProducts(filter);
  };

  return (
    <>
      <ModalDialog
        title={modalParams.title}
        message={modalParams.message}
        hasOkButton={modalParams.hasOkButton}
        hasYesButton={modalParams.hasYesButton}
        hasNoButton={modalParams.hasNoButton}
        yesButtonclassName={modalParams.yesButtonClass}
        noButtonclassName={modalParams.noButtonClass}
        showModal={modalParams.showModal}
        onOkButtonClick={modalParams.onOkButtonClick}
        onYesButtonClick={modalParams.onYesButtonClick}
        onNoButtonClick={modalParams.onNoButtonClick}
      />

      <button
        className="add-product-button ms-3 mt-2"
        onClick={async () => {
          //setLoading(true);
          router.push("/admin/products/add");
        }}
      >
        <i className="fa fa-plus" aria-hidden="true"></i> Add product
      </button>
      <div className="d-inline-block ms-3">
        <div className="input-group search-input-wrapper">
          <input
            className="form-control border-end-0 border rounded-pill shadow-none bg-primary"
            type="search"
            id="search-input"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-append ms-1">
            <button
              type="button"
              className="btn btn-outline-secondary search-btn bg-primary border-start-0 border rounded-pill ms-n3"
              onClick={(e) => search()}
            >
              <i className="fa fa-search admin-search-btn"></i>
            </button>
          </span>
        </div>
      </div>
      <div className="container-fluid mt-1 mb-3">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="d-none">#Id</th>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th className="description-th">Description</th>
              <th>Price</th>
              <th>Created date</th>
              <th>Total sold</th>
              <th className="actions-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.productList?.map((product, key) => (
              <tr key={product._id}>
                <td className="d-none">{product._id}</td>
                <td>
                  <img
                    className="product-item-img"
                    src={"/imgs/products/" + product.imageName}
                    alt="Product image"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.category?.name}</td>
                <td>{product.description}</td>
                <td>${product.price}</td>
                <td>{format(product.createdDate!, "dd-MM-yyyy HH:mm:ss")}</td>
                <td className="text-center">{product.ordersCount}</td>
                <td>
                  <a
                    className="btn btn-edit-admin ms-1 bg-primary me-2"
                    onClick={() => {
                      router.push("/admin/products/add/" + product._id);
                    }}
                  >
                    <i className="fa fa-save pe-1"></i>Edit
                  </a>
                  <a
                    className="btn btn-delete-admin ms-1 bg-danger me-2"
                    onClick={() => handleClickDelete(product._id!.toString())}
                  >
                    <i className="fa fa-trash pe-1"></i>Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        pagerParam={products?.pager}
        pageChanged={handlePageIndexChanged}
      ></Pagination>
      <span className="fst-italic ms-3">
        {products?.pager.paginationSummary}
      </span>
    </>
  );
}
