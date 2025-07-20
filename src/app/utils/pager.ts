import { PagerDTO } from "./../dtos/pagerDTO";
import { PagerHelperDTO } from "./../dtos/pagerHelperDTO";

export function pager(
  totalItems: number,
  pageCurrent: number,
  pageSize: number
): PagerDTO {
  let pagerObject: PagerDTO = {
    currentPage: 0,
    endPage: 0,
    hasNext: false,
    hasPrevious: false,
    pageSize: 0,
    startPage: 0,
    totalItems: 0,
    totalPages: 0,
    paginationSummary: "",
  };

  // calculate total, start and end pages
  let totalPages = Math.ceil(totalItems / pageSize);
  let currentPage = pageCurrent ? pageCurrent : 1;
  let startPage = currentPage - 5;
  let endPage = currentPage + 4;
  if (startPage <= 0) {
    endPage -= startPage - 1;
    startPage = 1;
  }
  if (endPage > totalPages) {
    endPage = totalPages;
    if (endPage > 10) {
      startPage = endPage - 9;
    }
  }

  pagerObject.totalItems = totalItems;
  pagerObject.currentPage = currentPage;
  pagerObject.pageSize = pageSize;
  pagerObject.totalPages = totalPages;
  pagerObject.startPage = startPage;
  pagerObject.endPage = endPage;
  pagerObject.hasPrevious = currentPage > 1;
  pagerObject.hasNext = currentPage < totalPages;

  return pagerObject;
}

function GetPaginationSummaryText(
  pageIndex: number,
  gridPagesize: number,
  totalCount: number
) {
  if (totalCount > 0) {
    let to = "";

    if (
      pageIndex * gridPagesize == 0 &&
      pageIndex * gridPagesize + gridPagesize <= totalCount
    ) {
      to = gridPagesize.toString();
    } else {
      let first: number = pageIndex * gridPagesize + 1;
      let second: number = first + gridPagesize - 1;

      if (second <= totalCount) to = second.toString();
      else to = totalCount.toString();
    }

    return (
      "Showing " +
      (pageIndex * gridPagesize + 1).toString() +
      " to " +
      to +
      " of " +
      totalCount +
      " entries"
    );
  } else return "Showing 0 to 0 of 0 entries";
}

export function pagerHelper(
  totalCount: number,
  pageIndex: number,
  pageSize: number,
  summaryTextAdd: string
): PagerHelperDTO {
  let pagerObject = pager(totalCount, pageIndex == 0 ? 1 : pageIndex, pageSize);

  let pageindexForSummary = 0;
  if (pageIndex != 0) pageindexForSummary = pageIndex - 1;
  pagerObject.paginationSummary =
    GetPaginationSummaryText(pageindexForSummary, pageSize, totalCount) +
    summaryTextAdd;

  return {
    pager: pagerObject,
    currentPage: pagerObject.currentPage,
    pageSize: pagerObject.pageSize,
  };
}
