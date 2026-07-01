import { fetchRegistrationPage } from "../api/registrationListApi";
import { exportRegistrationsPdf } from "../utils/pdfUtils";
import {
  BS_ENDPOINT,
  BS_PDF_COLUMN_STYLES,
  buildBsQueryParams,
} from "./bsRegistrationConfig";

export async function exportBsPdf(filters) {
  try {
    const result = await fetchRegistrationPage(
      BS_ENDPOINT,
      buildBsQueryParams({ filters, all: true }),
    );

    const filteredData = result.data;

    await exportRegistrationsPdf({
      title: "BS Registration List",
      meta: `Region: ${filters.region}    Generated: ${new Date().toLocaleDateString()}    Total: ${filteredData.length}`,
      columns: ["S/N", "Name", "Phone", "Gender", "Region", "Group", "Residence"],
      rows: filteredData.map((reg, index) => [
        index + 1,
        reg.fullName,
        reg.phoneNumber,
        reg.gender,
        reg.region,
        reg.groupName,
        reg.catchmentArea,
      ]),
      columnStyles: BS_PDF_COLUMN_STYLES,
      filename: `BS_Registrations_${filters.region}.pdf`,
    });
  } catch (err) {
    console.error("Export PDF failed:", err);
    alert("Failed to generate PDF. See console for details.");
  }
}
