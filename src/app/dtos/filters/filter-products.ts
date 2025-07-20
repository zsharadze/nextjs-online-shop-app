export interface FilterProducts {
  pageIndex: number;
  pageSize: number;
  categoryId?: number;
  searchText?: string;
  getOrdersCount?: boolean;
}
