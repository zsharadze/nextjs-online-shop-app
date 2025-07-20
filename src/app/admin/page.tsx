"use client";
import { useEffect, useState } from "react";
import AdminCategories from "./categories/page";
import AdminPromoCodes from "./promocodes/page";
import Orders from "./orders/page";
import AdminProducts from "./products/page";
import { useRouter, useSearchParams } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Orders");
  const searchParams = useSearchParams();

  useEffect(() => {
    let tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const setTab = (tab: string) => {
    router.replace("/admin/?tab=" + tab);
    setActiveTab(tab);
  };

  return (
    <main>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className={"nav-link " + (activeTab == "Orders" ? "active" : "")}
            id="nav-orders-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-orders"
            type="button"
            role="tab"
            aria-controls="nav-orders"
            aria-selected="true"
            onClick={() => {
              setTab("Orders");
            }}
          >
            Orders
          </button>
          <button
            className={"nav-link " + (activeTab == "Products" ? "active" : "")}
            id="nav-products-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-products"
            type="button"
            role="tab"
            aria-controls="nav-products"
            aria-selected="false"
            onClick={() => {
              setTab("Products");
            }}
          >
            Products
          </button>
          <button
            className={
              "nav-link " + (activeTab == "Categories" ? "active" : "")
            }
            id="nav-categories-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-categories"
            type="button"
            role="tab"
            aria-controls="nav-categories"
            aria-selected="false"
            onClick={() => {
              setTab("Categories");
            }}
          >
            Categories
          </button>
          <button
            className={
              "nav-link " + (activeTab == "PromoCodes" ? "active" : "")
            }
            id="nav-promocodes-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-promocodes"
            type="button"
            role="tab"
            aria-controls="nav-promocodes"
            aria-selected="false"
            onClick={() => {
              setTab("PromoCodes");
            }}
          >
            Promo Codes
          </button>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div
          className={
            "tab-pane fade " + (activeTab == "Orders" ? "show active" : "")
          }
          id="nav-orders"
          role="tabpanel"
          aria-labelledby="nav-orders-tab"
        >
          {activeTab == "Orders" && <Orders />}
        </div>
        <div
          className={
            "tab-pane fade " + (activeTab == "Products" ? "show active" : "")
          }
          id="nav-products"
          role="tabpanel"
          aria-labelledby="nav-products-tab"
        >
          {activeTab == "Products" && <AdminProducts />}
        </div>
        <div
          className={
            "tab-pane fade " + (activeTab == "Categories" ? "show active" : "")
          }
          id="nav-categories"
          role="tabpanel"
          aria-labelledby="nav-categories-tab"
        >
          {activeTab == "Categories" && <AdminCategories />}
        </div>
        <div
          className={
            "tab-pane fade " + (activeTab == "PromoCodes" ? "show active" : "")
          }
          id="nav-promocodes"
          role="tabpanel"
          aria-labelledby="nav-promocodes-tab"
        >
          {activeTab == "PromoCodes" && <AdminPromoCodes />}
        </div>
      </div>
    </main>
  );
}
