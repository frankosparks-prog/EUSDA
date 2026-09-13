export const BS_ENDPOINT = "/api/bs";

export const BS_REGIONS = [
  { value: "All", label: "All Regions" },
  { value: "In Campus", label: "In Campus" },
  { value: "Diaspora", label: "Diaspora" },
  { value: "Njokerio", label: "Njokerio" },
  { value: "Ahero", label: "Ahero" },
];

export const BS_TABLE_COLUMNS = 7;

export function buildBsQueryParams({ page, limit, filters, all = false }) {
  return {
    ...(all ? { all: true } : { page, limit }),
    region: filters.region,
    ...(filters.group && { group: filters.group }),
  };
}

export const BS_PDF_COLUMN_STYLES = {
  0: { cellWidth: 30 },
  1: { cellWidth: 120 },
  2: { cellWidth: 80 },
  3: { cellWidth: 50 },
  4: { cellWidth: 80 },
  5: { cellWidth: 100 },
  6: { cellWidth: 100 },
};
