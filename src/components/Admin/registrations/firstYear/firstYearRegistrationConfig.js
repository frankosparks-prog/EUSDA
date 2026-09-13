export const FIRST_YEAR_ENDPOINT = "/api/register";

export const GENDER_OPTIONS = [
  { value: "All", label: "All Genders" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const FIRST_YEAR_TABLE_COLUMNS = 6;

export function buildFirstYearQueryParams({ page, limit, filters, all = false }) {
  return {
    ...(all ? { all: true } : { page, limit }),
    gender: filters.gender,
    ...(filters.date && { date: filters.date }),
  };
}

export const FIRST_YEAR_PDF_COLUMN_STYLES = {
  0: { cellWidth: 30 },
  1: { cellWidth: 110 },
  2: { cellWidth: 80 },
  3: { cellWidth: 55 },
  4: { cellWidth: 90 },
  5: { cellWidth: 120 },
};
