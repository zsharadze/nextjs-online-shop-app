"use client";
import { useRouter } from "next/navigation";
import "../../styles/admin-categories.css";
import { FilterCategories } from "@/app/dtos/filters/filter-categories";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "@/app/shared/components/pagination";
import useStore from "@/app/store/store";
import { useDebounce } from "@/app/helpers/useDebounce";
import { deleteCategory } from "@/app/services/categories.service";
import { ModalDialog } from "@/app/shared/components/modal-dialog";
import { showToastError } from "@/app/helpers/toastService";

export default function AdminCategories() {
  const [filter, setFilter] = useState<FilterCategories>({
    searchText: null,
    pageIndex: 1,
    pageSize: 10,
  });
  const { categories, getCategories } = useStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const deleteCategoryId = useRef("");
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
    getCategories(filter);
  }, [filter]);

  useEffect(() => {
    search();
  }, [debouncedSearchTerm]);

  const search = () => {
    getCategories({
      pageIndex: 1,
      pageSize: 10,
      searchText: debouncedSearchTerm,
    });
  };

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({
      searchText: filter.searchText,
      pageIndex: pageIndex,
      pageSize: 10,
    });
  };

  const handleClickDelete = (id: string) => {
    deleteCategoryId.current = id;
    setModalParams({
      ...modalParams,
      showModal: true,
      onNoButtonClick: onCloseConfirmDeleteModal,
      onYesButtonClick: handleDeleteCategory,
    });
  };

  const onCloseConfirmDeleteModal = () => {
    setModalParams({ ...modalParams, showModal: false });
  };

  const handleDeleteCategory = async () => {
    setModalParams({ ...modalParams, showModal: false });
    let error = await deleteCategory(deleteCategoryId.current);
    if (error) {
      showToastError(error);
      return;
    }
    getCategories(filter);
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
        className="add-category-button ms-3 mt-2"
        onClick={async () => {
          router.push("/admin/categories/add");
        }}
      >
        <i className="fa fa-plus" aria-hidden="true"></i> Add category
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
              <th>Name</th>
              <th>Image</th>
              <th>Products count</th>
              <th className="actions-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.categoriesList?.map((category, key) => (
              <tr key={category._id}>
                <td className="d-none">{category._id}</td>
                <td>{category.name} </td>
                <td>
                  <img
                    className="category-item-img"
                    src={"/imgs/categories/" + category.imageName}
                    alt="Category image"
                  />
                </td>
                <td>{category.productsCount}</td>
                <td>
                  <a
                    className="btn btn-edit-admin ms-1 bg-primary me-2"
                    onClick={() => {
                      router.push("/admin/categories/add/" + category._id);
                    }}
                  >
                    <i className="fa fa-save pe-1"></i>Edit
                  </a>
                  <a
                    className="btn btn-delete-admin ms-1 bg-danger me-2"
                    onClick={() => handleClickDelete(category._id!.toString())}
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
        pagerParam={categories?.pager}
        pageChanged={handlePageIndexChanged}
      ></Pagination>
      <span className="fst-italic ms-3">{categories?.pager.paginationSummary}</span>
    </>
  );
}
