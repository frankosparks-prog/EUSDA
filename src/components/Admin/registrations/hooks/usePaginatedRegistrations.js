import { useCallback, useEffect, useState } from "react";
import { ROWS_PER_PAGE } from "../constants";
import { deleteRegistration, fetchRegistrationPage } from "../api/registrationListApi";
import { getPaginationState } from "../utils/paginationUtils";

export function usePaginatedRegistrations({ endpoint, filters, buildParams }) {
  const [registrations, setRegistrations] = useState([]);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchRegistrationPage(
        endpoint,
        buildParams({ page, limit: ROWS_PER_PAGE, filters }),
      );
      setRegistrations(result.data);
      setTotalFiltered(result.total);
      setTotalAll(result.totalAll);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, buildParams, page, filters]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    try {
      await deleteRegistration(endpoint, id);
      fetchRegistrations();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const resetPage = () => setPage(0);
  const { totalPages, safePage, rangeStart, rangeEnd } = getPaginationState(
    page,
    totalFiltered,
  );

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1));
  }, [page, totalPages]);

  return {
    registrations,
    totalFiltered,
    totalAll,
    loading,
    page,
    setPage,
    safePage,
    totalPages,
    rangeStart,
    rangeEnd,
    handleDelete,
    resetPage,
    fetchRegistrations,
  };
}
