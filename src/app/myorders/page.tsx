"use client";
import { useEffect, useState } from "react";
import useStore from "@/app/store/store";
import { OrderDTO } from "../dtos/orderDTO";
import { OrderItemDTO } from "../dtos/orderItemDTO";
import { FilterOrders } from "../dtos/filters/filter-orders";
import { format } from "date-fns";
import "./../styles/my-orders.css";
import { Pagination } from "../shared/components/pagination";
import { getBGOnOrderStatus } from "../shared/bg-class-order-status";

function MyOrders() {
  const { orders, getOrdersForCurrentUser } = useStore();
  const [filter, setFilter] = useState<FilterOrders>({
    pageIndex: 1,
    pageSize: 10,
  });
  useEffect(() => {
    getOrdersForCurrentUser(filter);
  }, [filter]);

  const handlePageIndexChanged = (pageIndex: number) => {
    setFilter({
      pageIndex: pageIndex,
      pageSize: filter.pageSize,
    });
  };

  return (
    <main>
      <div className="container-fluid">
        <i
          className="fa fa-arrow-circle-left ms-2 float-start"
          aria-hidden="true"
          title="Go back"
        ></i>
        <h3 className="text-center mb-3 text-center mt-2">My Orders</h3>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="d-none"># Order ID</th>
              <th className="details-th text-center">Details</th>
              <th className="text-center">Order Date</th>
              <th className="text-center">Status</th>
              <th className="text-center">Promo used</th>
              <th className="text-center">Subtotal</th>
              <th className="text-center">Subtotal with promo</th>
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
                      {order.orderItems.map((orderItem: OrderItemDTO, key) => (
                        <tr key={key}>
                          <td>
                            <img
                              className="order-item-img"
                              src={
                                "/imgs/products/" + orderItem.product.imageName
                              }
                              alt="Product image"
                            />
                          </td>
                          <td>
                            <span className="fw-bold">
                              {orderItem.product.name}
                            </span>
                            <br />
                            {orderItem.product.description}
                          </td>
                          <td>${orderItem.product.price}</td>
                          <td>{orderItem.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="text-center">
                  {format(order.createdDate, "dd-MM-yyyy HH:mm:ss")}
                </td>
                <td className="text-center">
                  <span
                    className={"btn btn-my-orders-status ms-1 " + getBGOnOrderStatus(order.status)}
                  >
                    {order.status}
                  </span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        pagerParam={orders?.pager}
        pageChanged={handlePageIndexChanged}
      ></Pagination>
      <span className="fst-italic ms-3">{orders?.pager.paginationSummary}</span>
    </main>
  );
}
export default MyOrders;
