import { ROWS_PER_PAGE } from "../constants";

export function getPaginationState(page, totalFiltered, rowsPerPage = ROWS_PER_PAGE) {
  const totalPages = Math.ceil(totalFiltered / rowsPerPage) || 1;
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const rangeStart = totalFiltered === 0 ? 0 : safePage * rowsPerPage + 1;
  const rangeEnd = Math.min((safePage + 1) * rowsPerPage, totalFiltered);

  return { totalPages, safePage, rangeStart, rangeEnd };
}
