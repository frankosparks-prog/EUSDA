import React, { useMemo, useState } from "react";
import AdminListHeader from "./registrations/components/AdminListHeader";
import AdminPagination from "./registrations/components/AdminPagination";
import FilterToolbar from "./registrations/components/FilterToolbar";
import { usePaginatedRegistrations } from "./registrations/hooks/usePaginatedRegistrations";
import FirstYearAdminLayout from "./registrations/firstYear/FirstYearAdminLayout";
import FirstYearFilters from "./registrations/firstYear/FirstYearFilters";
import FirstYearRegistrationsTable from "./registrations/firstYear/FirstYearRegistrationsTable";
import {
  FIRST_YEAR_ENDPOINT,
  buildFirstYearQueryParams,
} from "./registrations/firstYear/firstYearRegistrationConfig";
import { exportFirstYearPdf } from "./registrations/firstYear/exportFirstYearPdf";

function AdminRegistrations() {
  const [filterGender, setFilterGender] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const filters = useMemo(
    () => ({ gender: filterGender, date: filterDate }),
    [filterGender, filterDate],
  );

  const {
    registrations,
    totalFiltered,
    totalAll,
    loading,
    setPage,
    safePage,
    totalPages,
    rangeStart,
    rangeEnd,
    handleDelete,
    resetPage,
  } = usePaginatedRegistrations({
    endpoint: FIRST_YEAR_ENDPOINT,
    filters,
    buildParams: buildFirstYearQueryParams,
  });

  const handleGenderChange = (value) => {
    setFilterGender(value);
    resetPage();
  };

  const handleDateChange = (value) => {
    setFilterDate(value);
    resetPage();
  };

  const handleClearDate = () => {
    setFilterDate("");
    resetPage();
  };

  return (
    <FirstYearAdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <AdminListHeader
          title="First-Year Registrations"
          totalAll={totalAll}
          totalFiltered={totalFiltered}
          variant="modern"
        />

        <FilterToolbar
          variant="modern"
          onExportPdf={() => exportFirstYearPdf(filters)}
        >
          <FirstYearFilters
            filterGender={filterGender}
            filterDate={filterDate}
            onGenderChange={handleGenderChange}
            onDateChange={handleDateChange}
            onClearDate={handleClearDate}
          />
        </FilterToolbar>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto border border-gray-100">
        <FirstYearRegistrationsTable
          registrations={registrations}
          loading={loading}
          onDelete={handleDelete}
        />

        {!loading && totalFiltered > 0 && (
          <AdminPagination
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalFiltered={totalFiltered}
            safePage={safePage}
            totalPages={totalPages}
            borderClassName="border-gray-100"
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        )}
      </div>
    </FirstYearAdminLayout>
  );
}

export default AdminRegistrations;
