"use client";
import { PagerDTO } from "@/app/dtos/pagerDTO";
import "./../../styles/pagination.css";

export const Pagination = ({ pagerParam, pageChanged }: any) => {
  let pager: PagerDTO = pagerParam;
  let startEndIndexesArray: number[] = getStartEndIndexesArray();

  function getStartEndIndexesArray() {
    let resultArray = [];
    if (pager) {
      for (let page = pager.startPage; page <= pager.endPage; page++) {
        resultArray.push(page);
      }
    }
    return resultArray;
  }
  const changePage = (page: number) => {
    if (pager?.currentPage === page) return;
    pageChanged(page);
  };

  return (
    <nav className="ms-3" aria-label="...">
      <ul className="pagination">
        {pager?.currentPage > 6 && (
          <>
            <li className={"page-item " + pager?.hasPrevious ? "" : "disabled"}>
              <button
                className="page-link"
                tabIndex={-1}
                aria-disabled="true"
                onClick={(e) => changePage(pager?.currentPage - 1)}
              >
                Previous
              </button>
            </li>
            <li className="page-item">
              <button className="page-link" onClick={(e) => changePage(1)}>
                1
              </button>
            </li>
            <li>
              <a>...</a>
            </li>
          </>
        )}
        {startEndIndexesArray.map((page) => (
          <li
            key={page}
            className={
              startEndIndexesArray.length <= 1
                ? page === pager?.currentPage
                  ? "active page-item d-none"
                  : "page-item"
                : page === pager?.currentPage
                ? "active page-item"
                : "page-item"
            }
          >
            <button className="page-link" onClick={(e) => changePage(page)}>
              {page}
            </button>
          </li>
        ))}
        {pager?.currentPage + 4 < pager?.totalPages && (
          <>
            <li>
              <a>...</a>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={(e) => changePage(pager?.totalPages)}
              >
                {pager?.totalPages}
              </button>
            </li>
          </>
        )}
        {pager && pager.totalPages > 1 && (
          <li className="page-item">
            <button
              className={"page-link " + (pager?.hasNext ? "" : "disabled")}
              onClick={(e) => changePage(pager?.currentPage + 1)}
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
