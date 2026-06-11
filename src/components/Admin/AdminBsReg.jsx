import React, { useMemo, useState } from "react";
import AdminListHeader from "./registrations/components/AdminListHeader";
import AdminPagination from "./registrations/components/AdminPagination";
import FilterToolbar from "./registrations/components/FilterToolbar";
import { usePaginatedRegistrations } from "./registrations/hooks/usePaginatedRegistrations";
import BsFilters from "./registrations/bs/BsFilters";
import BsRegistrationsTable from "./registrations/bs/BsRegistrationsTable";
import {
  BS_ENDPOINT,
  buildBsQueryParams,
} from "./registrations/bs/bsRegistrationConfig";
import { exportBsPdf } from "./registrations/bs/exportBsPdf";

function AdminBsReg() {
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterGroup, setFilterGroup] = useState("");

  const filters = useMemo(
    () => ({ region: filterRegion, group: filterGroup }),
    [filterRegion, filterGroup],
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
    endpoint: BS_ENDPOINT,
    filters,
    buildParams: buildBsQueryParams,
  });

  const handleRegionChange = (value) => {
    setFilterRegion(value);
    resetPage();
  };

  const handleGroupChange = (value) => {
    setFilterGroup(value);
    resetPage();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <AdminListHeader
          title="BS Registrations"
          totalAll={totalAll}
          totalFiltered={totalFiltered}
        />

        <FilterToolbar onExportPdf={() => exportBsPdf(filters)}>
          <BsFilters
            filterRegion={filterRegion}
            filterGroup={filterGroup}
            onRegionChange={handleRegionChange}
            onGroupChange={handleGroupChange}
          />
        </FilterToolbar>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <BsRegistrationsTable
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
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        )}
      </div>
    </div>
  );
}

export default AdminBsReg;
