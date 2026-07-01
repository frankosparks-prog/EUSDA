import { format } from "date-fns";
import { fetchRegistrationPage } from "../api/registrationListApi";
import { exportRegistrationsPdf } from "../utils/pdfUtils";
import {
  FIRST_YEAR_ENDPOINT,
  FIRST_YEAR_PDF_COLUMN_STYLES,
  buildFirstYearQueryParams,
} from "./firstYearRegistrationConfig";

export async function exportFirstYearPdf(filters) {
  try {
    const result = await fetchRegistrationPage(
      FIRST_YEAR_ENDPOINT,
      buildFirstYearQueryParams({ filters, all: true }),
    );

    const filteredData = result.data;
    const dateLabel = filters.date
      ? format(new Date(filters.date), "do MMM yyyy")
      : "All Dates";

    await exportRegistrationsPdf({
      title: "First-Year Registration List",
      meta: `Gender: ${filters.gender}    Date: ${dateLabel}    Generated: ${new Date().toLocaleDateString()}    Total: ${filteredData.length}`,
      columns: ["S/N", "Name", "Phone", "Gender", "Date Registered", "Email"],
      rows: filteredData.map((reg, index) => [
        index + 1,
        reg.fullName,
        reg.phoneNumber,
        reg.gender,
        format(new Date(reg.createdAt), "do MMM yyyy"),
        reg.email || "—",
      ]),
      columnStyles: FIRST_YEAR_PDF_COLUMN_STYLES,
      filename: `FirstYear_Registrations_${filters.gender === "All" ? "All" : filters.gender}_${filters.date || "AllDates"}.pdf`,
    });
  } catch (err) {
    console.error("Export PDF failed:", err);
    alert("Failed to generate PDF. See console for details.");
  }
}
