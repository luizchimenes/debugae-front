export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}