export interface Pagination {
  page?: number;
  perPage?: number;

  filter?: { field: string; operator?: string; value: string | number }[];
}
