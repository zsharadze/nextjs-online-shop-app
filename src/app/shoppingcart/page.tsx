"use client";
import { useState } from "react";
import useStore from "@/app/store/store";
import "./../styles/shopping-cart.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreateOrderDTO, CreateOrderItem } from "../dtos/createOrderDTO";
import { createOrder } from "../services/order.service";
import { getByPromoCodeText } from "../services/promo-codes.service";
import { showToastError } from "../helpers/toastService";

export default function ShoppingCart() {
  const {
    shoppingCart,
    changeQuantityInCart,
    removeItemFromCart,
    clearShoppingCart,
  } = useStore();
  const router = useRouter();
  const [btnPlaceOrderDisabled, setBtnPlaceOrderDisabled] = useState(false);
  const [enteredPromoCode, setEnteredPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [appliedPromoCodeDiscount, setAppliedPromoCodeDiscount] = useState(0);
  const { data: session, status } = useSession();

  const handleQuantityChange = async (e: any, id: string) => {
    let quantity = e.target.value;
    changeQuantityInCart(id, Number(quantity));
  };
  const handleDelete = async (id: string) => {
    removeItemFromCart(id);
  };
  const handleApplyPromoCode = async () => {
    let result = await getByPromoCodeText(enteredPromoCode);
    if (!result) {
      setEnteredPromoCode("");
      showToastError("Applied promo code is invalid.");
    } else {
      setAppliedPromoCode(enteredPromoCode);
      setAppliedPromoCodeDiscount(result.discount);
    }
  };
  const getSubTotal = (withPromo: boolean) => {
    let subTotal = shoppingCart.reduce(
      (total, item) => item.totalPrice! + total,
      0
    );
    subTotal = subTotal - (withPromo ? appliedPromoCodeDiscount : 0);

    return subTotal <= 0 ? 0 : subTotal;
  };

  const handlePlaceOrder = async () => {
    if (status != "authenticated") router.push("/auth/login");
    setBtnPlaceOrderDisabled(true);
    let order: CreateOrderDTO = {
      orderItemList: shoppingCart.map<CreateOrderItem>(function (item) {
        return {
          productId: item.productId,
          quantity: item.quantity,
        };
      }),
      promoCode: appliedPromoCode,
    };

    await createOrder(order);
    await clearShoppingCart();
    router.push("/myorders");
  };

  return (
    <>
      <i
        className="fa fa-arrow-circle-left ms-2 mt-2 float-start"
        aria-hidden="true"
        title="Go back"
        onClick={() => {
          router.push("/");
        }}
      ></i>
      <div className="container container-shopping-cart">
        {shoppingCart.length > 0 && (
          <main className="main-content main-content-shopping-cart mt-3">
            <div className="order-summary">
              <h4>Shopping cart items:</h4>
              <ul className="product-list">
                {shoppingCart?.map((shoppingCartItem) => (
                  <li key={shoppingCartItem.productId}>
                    <img
                      src={"/imgs/products/" + shoppingCartItem.imageName}
                      alt={shoppingCartItem.imageName}
                    />
                    <div className="product-details">
                      <h3 className="fw-bold">{shoppingCartItem.name}</h3>
                      <p id="description">{shoppingCartItem.description}</p>

                      <div className="d-flex align-items-center">
                        <h4 id="productTotalPrice" className="fw-bold mt-2">
                          ${shoppingCartItem.totalPrice}
                        </h4>
                        <label className="ms-3 me-2 ps-3" htmlFor="quantity">
                          Quantity:
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          className="form-control w-25"
                          min="1"
                          value={shoppingCartItem.quantity}
                          onChange={(e) =>
                            handleQuantityChange(e, shoppingCartItem.productId)
                          }
                        />
                        <i
                          className="fa fa-trash deleteItemBtn ms-3"
                          aria-hidden="true"
                          onClick={() =>
                            handleDelete(shoppingCartItem.productId)
                          }
                        ></i>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="product-details">
              {!appliedPromoCode && (
                <div id="withoutPromoWrapper">
                  <label htmlFor="quantity" className="me-2">
                    Do you have promo code?
                  </label>
                  <div className="d-flex align-items-center mb-4">
                    <input
                      type="text"
                      className="form-control w-75 me-2"
                      placeholder="Promo Code"
                      value={enteredPromoCode}
                      onChange={(e) => {
                        setEnteredPromoCode(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary w-50"
                      onClick={handleApplyPromoCode}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
              {appliedPromoCode && (
                <div id="withPromoWrapper">
                  <button type="button" className="btn btn-warning w-100">
                    Promo code applied
                  </button>
                </div>
              )}
              <div className="product-attributes">
                <ul>
                  <li>
                    {!appliedPromoCode && (
                      <h5 className="fw-bold">
                        Subtotal:{" "}
                        <span className="float-end">{getSubTotal(false)}</span>
                      </h5>
                    )}
                    {appliedPromoCode && (
                      <h5 className="fw-bold">
                        <s>Subtotal: </s>
                        <span className="float-end">
                          <s>{getSubTotal(false)}</s>
                        </span>
                      </h5>
                    )}
                  </li>
                  {appliedPromoCode && (
                    <li>
                      <h5 className="fw-bold">
                        Subtotal with promo:
                        <span className="float-end">{getSubTotal(true)}</span>
                      </h5>
                    </li>
                  )}
                </ul>
              </div>
              <button
                disabled={btnPlaceOrderDisabled}
                className="btn btn-success w-100"
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
            </div>
          </main>
        )}
        {shoppingCart.length === 0 && (
          <main className="main-content mt-3">
            <div className="product-summary-list text-center">
              <h2 className="text-primary">Shopping cart is empty.</h2>
            </div>
          </main>
        )}
      </div>
    </>
  );
}
