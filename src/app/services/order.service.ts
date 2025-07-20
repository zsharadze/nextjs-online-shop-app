"use server";
import {
  dbConnectWithCheckUserPermission,
  dbConnectWithCheckUserPermissionAdmin,
} from "@/app/data/connectMongo";
import { CreateOrderDTO } from "../dtos/createOrderDTO";
import { Product } from "../data/models/product.model";
import { Order } from "../data/models/order.model";
import { auth } from "@/auth";
import { OrderItem } from "../data/models/order-item.model";
import { OrdersDTO } from "../dtos/ordersDTO";
import { pagerHelper } from "../utils/pager";
import { FilterOrders } from "../dtos/filters/filter-orders";
import { PromoCode } from "../data/models/promo-code.model";
import { OrderStatuses } from "../shared/order-statuses";

export const createOrder = async (order: CreateOrderDTO) => {
  try {
    const session: any = await auth();
    await dbConnectWithCheckUserPermission();
    let productIds = order.orderItemList.map((x) => x.productId);
    let subtotal = 0;
    let subtotalWithPromo: number | null = null;
    let usedPromoCodeId = null;
    let orderProducts = await Product.find({ _id: { $in: productIds } });

    subtotal = orderProducts.reduce((accumulator, currentValue) => {
      let prod = order.orderItemList.find(
        (x) => x.productId == currentValue._id
      );

      return accumulator + currentValue.price * prod!.quantity;
    }, 0);

    if (order.promoCode) {
      let appliedPromo = await PromoCode.findOne({
        promoCodeText: order.promoCode,
      });
      if (appliedPromo.isUsed) {
        throw new Error("promo code already used");
      }
      //calculate subtotal with promo
      subtotalWithPromo = subtotal - appliedPromo.discount;
      usedPromoCodeId = appliedPromo._id;
      if (subtotalWithPromo < 0) subtotalWithPromo = 0;
    } else {
      subtotalWithPromo = null;
    }

    let orderItems = order.orderItemList.map((item) => {
      return {
        quantity: item.quantity,
        product: item.productId,
      };
    });

    let savedOrderItems = await OrderItem.insertMany(orderItems);

    const newOrder = new Order({
      createdDate: new Date(),
      subtotal: subtotal,
      subtotalWithPromo: subtotalWithPromo,
      userId: session.user.id,
      promoCode: usedPromoCodeId,
      orderItems: savedOrderItems.map((x) => x._id),
    });

    await newOrder.save();

    //mark promocode as used
    if (subtotalWithPromo != null) {
      await PromoCode.findOneAndUpdate(
        { promoCodeText: order.promoCode },
        {
          $set: {
            isUsed: true,
            usedByUserEmail: session.user.email,
            usedOnOrderId: newOrder._id,
          },
        }
      );
    }
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getAllOrdersForCurrentUser = async (
  filter: FilterOrders
): Promise<OrdersDTO> => {
  const session: any = await auth();
  await dbConnectWithCheckUserPermission();

  try {
    let summaryTextAdd = "";
    let query = { userId: session.user.id };

    let totalCount = await Order.countDocuments(query);
    let pagerHelperObject = await pagerHelper(
      totalCount,
      filter.pageIndex,
      filter.pageSize,
      summaryTextAdd
    );

    let result: OrdersDTO = {
      pager: pagerHelperObject.pager,
      orderList: await Order.find(query)
        .sort({ createdDate: -1 })
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .populate({
          path: "orderItems",
          populate: {
            path: "product",
          },
        })
        .populate("promoCode"),
    };
    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const getAllOrders = async (
  filter: FilterOrders
): Promise<OrdersDTO> => {
  await dbConnectWithCheckUserPermissionAdmin();

  try {
    let summaryTextAdd = "";
    let query = {};

    let totalCount = await Order.countDocuments(query);
    let pagerHelperObject = await pagerHelper(
      totalCount,
      filter.pageIndex,
      filter.pageSize,
      summaryTextAdd
    );

    let result: OrdersDTO = {
      pager: pagerHelperObject.pager,
      orderList: await Order.find(query)
        .sort({ createdDate: -1 })
        .skip((filter.pageIndex - 1) * filter.pageSize)
        .limit(filter.pageSize)
        .populate({
          path: "orderItems",
          populate: {
            path: "product",
          },
        })
        .populate("promoCode"),
    };

    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};

export const changeOrderStatus = async (orderId: string, newStatus: string) => {
  await dbConnectWithCheckUserPermissionAdmin();

  const statusArray = OrderStatuses;

  if (!statusArray.includes(newStatus)) {
    throw new Error("invalid status passed");
  }

  await Order.findByIdAndUpdate(orderId, { status: newStatus });
};

export const deleteOrder = async (id: string) => {
  try {
    await dbConnectWithCheckUserPermissionAdmin();
    let orderToDelete = await Order.findById(id);

    if (!orderToDelete) {
      return "order with id " + id + " does not exist";
    }

    let orderItems = await OrderItem.find({
      _id: { $in: orderToDelete.orderItems.map((o: any) => o.toString()) },
    });

    await OrderItem.deleteMany({
      _id: { $in: orderItems.map((o) => o._id.toString()) },
    });

    await orderToDelete.deleteOne({ _id: id });
    return "";
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
};
