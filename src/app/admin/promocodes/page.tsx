"use client";
import "../../styles/admin-categories.css";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "@/app/shared/components/pagination";
import { ModalDialog } from "@/app/shared/components/modal-dialog";
import "../../styles/admin-promo-codes.css";
import {
  deletePromoCode,
  generatePromoCodes,
} from "@/app/services/promo-codes.service";
import useStore from "@/app/store/store";
import { FilterPromoCodes } from "@/app/dtos/filters/filter-promo-codes";
import { PromoCodeDTO } from "@/app/dtos/promoCodeDTO";
import { format } from "date-fns";
import { showToastError } from "@/app/helpers/toastService";
import { useDebounce } from "@/app/helpers/useDebounce";

export default function AdminPromoCodes() {
  const { promoCodes, getPromoCodes } = useStore();
  const deletePromoCodeId = useRef("");
  const [generationParams, setGenerationParams] = useState({
    quantity: 1,
    discount: 50,
  });
  const [filter, setFilter] = useState<FilterPromoCodes>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
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
    getPromoCodes(filter);
  }, [filter]);

  useEffect(() => {
    search();
  }, [debouncedSearchTerm]);

  const search = () => {
    getPromoCodes({
      ...filter,
      pageIndex: 1,
      searchText: debouncedSearchTerm,
    });
  };

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({
      pageIndex: pageIndex,
      pageSize: filter.pageSize,
    });
  };

  const handleClickDelete = (id: string) => {
    deletePromoCodeId.current = id;
    setModalParams({
      ...modalParams,
      showModal: true,
      onNoButtonClick: onCloseConfirmDeleteModal,
      onYesButtonClick: handleDeletePromoCode,
    });
  };

  const onCloseConfirmDeleteModal = () => {
    setModalParams({ ...modalParams, showModal: false });
  };

  const handleDeletePromoCode = async () => {
    setModalParams({ ...modalParams, showModal: false });
    let deleted = await deletePromoCode(deletePromoCodeId.current);
    if (deleted) getPromoCodes(filter);
    else showToastError("used promo code can't be deleted");
  };

  const generate = async () => {
    await generatePromoCodes(generationParams);
    await getPromoCodes(filter);
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
      <div className="d-inline-block ms-3 mt-2 generate-inputs-wrapper">
        <div className="d-inline-block">
          <label htmlFor="quantity" className="me-2">
            Quantity:
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control me-3 d-inline-block btn-quantity"
            min="1"
            value={generationParams.quantity}
            onChange={(e) =>
              setGenerationParams({
                quantity: Number(e.target.value),
                discount: generationParams.discount,
              })
            }
          />
        </div>
        <div className="d-inline-block">
          <label htmlFor="quantity" className="me-2">
            Discount $:
          </label>
          <input
            type="number"
            id="quantity"
            className="form-control me-2 d-inline-block btn-discount"
            min="1"
            value={generationParams.discount}
            onChange={(e) =>
              setGenerationParams({
                quantity: generationParams.quantity,
                discount: Number(e.target.value),
              })
            }
          />
        </div>
        <button
          className="generate-button"
          onClick={async () => await generate()}
        >
          <i className="fa fa-plus" aria-hidden="true"></i> Generate new promo
          codes
        </button>
      </div>      
      <div className="container-fluid mt-1 mb-3">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="d-none">#Id</th>
              <th>Promo Code</th>
              <th>Discount</th>
              <th>Created Date</th>
              <th>Used by user</th>
              <th>Used in order #</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes?.promoCodeList?.map((promoCode: PromoCodeDTO) => (
              <tr key={promoCode._id}>
                <td className="d-none">{promoCode._id}</td>
                <td>{promoCode.promoCodeText}</td>
                <td>{promoCode.discount}</td>
                <td>{format(promoCode.createdDate, "dd-MM-yyyy HH:mm:ss")}</td>
                <td>{promoCode.usedByUserEmail}</td>
                <td>{promoCode.usedOnOrderId}</td>
                <td>
                  <a
                    className="btn btn-delete ms-1 bg-danger me-2"
                    onClick={() => handleClickDelete(promoCode._id!.toString())}
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
        pagerParam={promoCodes?.pager}
        pageChanged={handlePageIndexChanged}
      ></Pagination>
      <span className="fst-italic ms-3">{promoCodes?.pager.paginationSummary}</span>
    </>
  );
}
