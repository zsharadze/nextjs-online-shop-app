"use client";
import useStore from "@/app/store/store";
import "./../../styles/header.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/app/helpers/useDebounce";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export const Header = ({ title, content, footer }: any) => {
  const pathname = usePathname();
  const { getProducts, shoppingCart } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const { data: session, status } = useSession();

  useEffect(() => {
    search();
  }, [debouncedSearchTerm]);

  const search = () => {
    getProducts({
      pageIndex: 1,
      pageSize: 10,
      searchText: debouncedSearchTerm,
    });
  };

  return (
    <header className="header">
      <div className="d-flex justify-content-between">
        <Link href="/" className="goToHomeLink">
          <div
            className="ms-2 d-flex justify-content-center align-self-center"
            role="button"
          >
            <img className="angular-icon" src="/nextjs-logo.png" />
            <h3 className="mt-2 ms-1">Nextjs Computer Shop</h3>
          </div>
        </Link>
        {pathname == "/" && (
          <div>
            <div className="input-group search-input-wrapper">
              <input
                className="form-control border-end-0 border rounded-pill shadow-none"
                type="search"
                id="search-input"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-append ms-1">
                <button
                  className="btn btn-outline-secondary header-search-btn bg-white border-start-0 border rounded-pill ms-n3"
                  type="button"
                  onClick={(e) => search()}
                >
                  <i className="fa fa-search header-search-hover"></i>
                </button>
              </span>
            </div>
          </div>
        )}
        <div className="p-2">
          <ul className="nav justify-content-end">
            <li className="nav-item" title="Shopping cart">
              <Link className="dropdown-item" href="/shoppingcart">
                <i className="fa fa-shopping-cart me-3">
                  <span className="badge bg-danger">
                    {shoppingCart!.length != 0 ? shoppingCart!.length : ""}
                  </span>
                </i>
              </Link>
            </li>
            <li className="nav-item" title="Administration">
              <Link className="dropdown-item" href="/admin">
                <i className="fa fa-wrench me-3"></i>
              </Link>
            </li>
            <li className="nav-item">
              <div className="dropdown">
                <a
                  id="dropdownMenuLink"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-user-circle me-3"></i>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-dark"
                  aria-labelledby="dropdownMenuLink"
                >
                  {status == "authenticated" && (
                    <>
                      <li>
                        <a className="dropdown-item">Logged in as: {session?.user?.email}</a>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/myorders">
                          My orders
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          href="/auth/changepassword"
                        >
                          Change password
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            signOut();
                          }}
                        >
                          Sign out
                        </button>
                      </li>
                    </>
                  )}

                  {status != "authenticated" && (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/auth/login">
                          Sign in
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/auth/register">
                          Register
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
