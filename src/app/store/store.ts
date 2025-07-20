import { create } from "zustand";
import { ProductsDTO } from "../dtos/productsDTO";
import { getAllProducts, getProductByIdDetails } from "@/app/services/products.service";
import { FilterProducts } from "../dtos/filters/filter-products";
import { CategoriesDTO } from "../dtos/categoriesDTO";
import { FilterCategories } from "../dtos/filters/filter-categories";
import { getAllCategories } from "@/app/services/categories.service";
import { ShoppingCartItemDTO } from "../dtos/shoppingCartItemDTO";
import { OrdersDTO } from "../dtos/ordersDTO";
import { FilterOrders } from "../dtos/filters/filter-orders";
import {
  getAllOrders,
  getAllOrdersForCurrentUser,
} from "../services/order.service";
import { PromoCodesDTO } from "../dtos/promoCodesDTO";
import { FilterPromoCodes } from "../dtos/filters/filter-promo-codes";
import { getAllPromoCodes } from "../services/promo-codes.service";
import { ProductDTO } from "../dtos/productDTO";

interface MyState {
  loading: boolean;
  setLoading: (show: boolean) => Promise<void>;
  products: ProductsDTO | null;
  getProducts: (filter: FilterProducts) => Promise<void>;
  categories: CategoriesDTO | null;
  getCategories: (filter: FilterCategories | null) => Promise<void>;
  shoppingCart: ShoppingCartItemDTO[];
  addToShoppingCart: (item: ShoppingCartItemDTO) => Promise<void>;
  changeQuantityInCart: (productId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (productId: string) => Promise<void>;
  clearShoppingCart: () => Promise<void>;
  toastIsShown: boolean;
  setToastIsShown: (shown: boolean) => Promise<void>;
  orders: OrdersDTO | null;
  getOrdersForCurrentUser: (filter: FilterOrders) => Promise<void>;
  getOrders: (filter: FilterOrders) => Promise<void>;
  promoCodes: PromoCodesDTO | null;
  getPromoCodes: (filter: FilterPromoCodes) => Promise<void>;
  product: ProductDTO | null;
  getProduct: (id: string) => Promise<void>;
}

const useStore = create<MyState>((set, get) => ({
  loading: false,
  setLoading: async (show: boolean) => {
    set({ loading: show });
  },
  products: null,
  getProducts: async (filter: FilterProducts) => {
    set({ loading: true });
    const result = await getAllProducts(filter);
    set({ products: result });
    set({ loading: false });
  },
  categories: null,
  getCategories: async (filter: FilterCategories | null) => {
    set({ loading: true });
    const result = await getAllCategories(
      filter ? filter : ({} as FilterCategories)
    );
    set({ categories: result });
    set({ loading: false });
  },
  shoppingCart: [],
  addToShoppingCart: async (item: ShoppingCartItemDTO) => {
    set((state) => {
      let shoppingCartArray: ShoppingCartItemDTO[] = [];
      shoppingCartArray = shoppingCartArray.concat(state.shoppingCart);
      let foundIndex = shoppingCartArray.findIndex(
        (x) => x.productId === item.productId
      );
      if (shoppingCartArray.length === 0 || foundIndex === -1) {
        shoppingCartArray.push({
          ...item,
          totalPrice: item.unitPrice! * item.quantity!,
        });
      } else {
        if (foundIndex > -1) {
          shoppingCartArray[foundIndex] = {
            ...shoppingCartArray[foundIndex],
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice! * item.quantity!,
          };
        }
      }

      return { shoppingCart: shoppingCartArray };
    });
  },
  changeQuantityInCart: async (productId: string, quantity: number) => {
    set((state) => {
      let shoppingCartArray: ShoppingCartItemDTO[] = [...state.shoppingCart];

      let foundIndex = shoppingCartArray.findIndex(
        (x) => x.productId === productId
      );
      if (foundIndex > -1) {
        shoppingCartArray[foundIndex] = {
          ...shoppingCartArray[foundIndex],
          quantity: quantity,
          totalPrice: shoppingCartArray[foundIndex]?.unitPrice! * quantity,
        };
      }
      return { shoppingCart: shoppingCartArray };
    });
  },
  removeItemFromCart: async (productId: string) => {
    set((state) => {
      let shoppingCartArray: ShoppingCartItemDTO[] = [...state.shoppingCart];

      let foundIndex = state.shoppingCart.findIndex(
        (x) => x.productId === productId
      );

      shoppingCartArray.splice(foundIndex, 1);

      return { shoppingCart: shoppingCartArray };
    });
  },
  clearShoppingCart: async () => {
    set({ shoppingCart: [] });
  },
  toastIsShown: false,
  setToastIsShown: async (show: boolean) => {
    set({ toastIsShown: show });
  },
  orders: null,
  getOrdersForCurrentUser: async (filter: FilterOrders) => {
    set({ loading: true });
    const result = await getAllOrdersForCurrentUser(filter);
    set({ orders: result });
    set({ loading: false });
  },
  getOrders: async (filter: FilterOrders) => {
    set({ loading: true });
    const result = await getAllOrders(filter);
    set({ orders: result });
    set({ loading: false });
  },
  promoCodes: null,
  getPromoCodes: async (filter: FilterPromoCodes) => {
    set({ loading: true });
    const result = await getAllPromoCodes(filter);
    set({ promoCodes: result });
    set({ loading: false });
  },
  product:null,
  getProduct: async (id: string) => {
    set({ loading: true });
    const result = await getProductByIdDetails(id);
    set({ product: result });
    set({ loading: false });
  },
}));

export default useStore;
