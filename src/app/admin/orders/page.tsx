"use client";
import { useEffect, useRef, useState } from "react";
import useStore from "@/app/store/store";
import { OrderDTO } from "./../../dtos/orderDTO";
import { OrderItemDTO } from "./../../dtos/orderItemDTO";
import { FilterOrders } from "./../../dtos/filters/filter-orders";
import { format } from "date-fns";
import "./../../styles/orders.css";
import { Pagination } from "./../../shared/components/pagination";
import { changeOrderStatus, deleteOrder } from "@/app/services/order.service";
import { OrderStatuses } from "@/app/shared/order-statuses";
import { getBGOnOrderStatus } from "@/app/shared/bg-class-order-status";
import { showToastError } from "@/app/helpers/toastService";
import { ModalDialog } from "@/app/shared/components/modal-dialog";

function Orders() {
  const { orders, getOrders } = useStore();
  const [filter, setFilter] = useState<FilterOrders>({
    pageIndex: 1,
    pageSize: 10,
  });
  const [editStatusOrderId, setEditStatusOrderId] = useState<string>("");
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [orderStatuses] = useState<string[]>(OrderStatuses);
  const deleteOrderId = useRef("");
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
    getOrders(filter);
  }, [filter]);

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({
      pageIndex: pageIndex,
      pageSize: filter.pageSize,
    });
  };

  const editStatus = (id: string, status: string) => {
    if (!editStatusOrderId) {
      setEditedStatus(status);
      setEditStatusOrderId(id);
    }
  };

  const onStatusChange = (order: OrderDTO, status: string) => {
    setEditedStatus(status);
  };

  const saveEditedStatus = () => {
    changeOrderStatus(editStatusOrderId, editedStatus);
    setEditStatusOrderId("");
    setEditedStatus("");
    getOrders(filter);
  };

  const onCloseConfirmDeleteModal = () => {
    setModalParams({ ...modalParams, showModal: false });
  };

  const handleDeleteOrder = async () => {
    setModalParams({ ...modalParams, showModal: false });
    let error = await deleteOrder(deleteOrderId.current);
    if (error) {
      showToastError(error);
      return;
    }
    getOrders(filter);
  };

  const handleClickDelete = (id: string) => {
    deleteOrderId.current = id;
    setModalParams({
      ...modalParams,
      showModal: true,
      onNoButtonClick: onCloseConfirmDeleteModal,
      onYesButtonClick: handleDeleteOrder,
    });
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
      <main>
        <div className="container-fluid">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th className="d-none"># Order ID</th>
                <th className="details-th text-center">Details</th>
                <th className="text-center">Order Date</th>
                <th className="text-center">Promo used</th>
                <th className="text-center">Subtotal</th>
                <th className="text-center">Subtotal with promo</th>
                <th className="status-th">Status</th>
                <th className="actions-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.orderList?.map((order: OrderDTO) => (
                <tr key={order._id}>
                  <td className="d-none">{order._id}</td>
                  <td>
                    <table className="table table-bordered">
                      <thead className="table-info">
                        <tr>
                          <th></th>
                          <th className="text-center">Description</th>
                          <th className="text-center">Price</th>
                          <th className="text-center">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderItems.map(
                          (orderItem: OrderItemDTO, key) => (
                            <tr key={key}>
                              <td>
                                <img
                                  className="order-item-img"
                                  src={
                                    "/imgs/products/" +
                                    orderItem.product?.imageName
                                  }
                                  alt="Product image"
                                />
                              </td>
                              <td>
                                <span className="fw-bold">
                                  {orderItem.product?.name}
                                </span>
                                <br />
                                {orderItem.product?.description}
                              </td>
                              <td>${orderItem.product?.price}</td>
                              <td>{orderItem.quantity}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </td>
                  <td className="text-center">
                    {format(order.createdDate, "dd-MM-yyyy HH:mm:ss")}
                  </td>
                  <td className="text-center">
                    {!order.promoCode ? "No" : "Yes"}
                  </td>
                  <td className="text-center">${order.subtotal}</td>
                  <td className="text-center">
                    {order.subtotalWithPromo || order.subtotalWithPromo == 0
                      ? "$" + order.subtotalWithPromo
                      : ""}
                  </td>
                  <td className="text-center">
                    {order._id != editStatusOrderId && (
                      <div className="text-center">
                        <span
                          className={
                            "btn btn-edit ms-1 " +
                            getBGOnOrderStatus(order.status)
                          }
                        >
                          {order.status}
                        </span>
                        <a
                          className="btn btn-edit ms-1"
                          onClick={() => editStatus(order._id!, order.status)}
                        >
                          <i className="fa fa-edit"></i>Edit
                        </a>
                      </div>
                    )}
                    {order._id == editStatusOrderId && (
                      <div className="text-center">
                        <select
                          className="form-select d-inline status-select"
                          defaultValue={order.status}
                          onChange={(e) => {
                            onStatusChange(order, e.target.value);
                          }}
                        >
                          {orderStatuses.map((orderStatus: string) => (
                            <option key={orderStatus} value={orderStatus}>
                              {orderStatus}
                            </option>
                          ))}
                        </select>

                        <a
                          className="btn btn-save ms-1 bg-success"
                          onClick={() => saveEditedStatus()}
                        >
                          <i className="fa fa-save"></i>Save
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    <a
                      className="btn btn-delete-admin ms-1 bg-danger me-2"
                      onClick={() => handleClickDelete(order._id!.toString())}
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
          pagerParam={orders?.pager}
          pageChanged={handlePageIndexChanged}
        ></Pagination>
        <span className="fst-italic ms-3">
          {orders?.pager.paginationSummary}
        </span>
      </main>
    </>
  );
}
export default Orders;
