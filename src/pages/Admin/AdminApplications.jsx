import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "./AdminLayout";
import { useTranslation } from "../../i18n";

const AdminApplications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(searchParams.get("status") || "");
  }, [searchParams]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status) {
        params.set("status", status);
      }

      params.set("limit", "10000");

      const response = await fetch(
        `/api/admin/applications?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch applications.");
      }

      setApplications(data?.data || []);
    } catch (error) {
      console.error("Applications error:", error);

      Swal.fire({
        icon: "error",
        title: t("admin.applications"),
        text: error?.message || t("register.somethingWrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    navigate("/admin/applications");
  };

  const getStatusBadge = (itemStatus) => {
    switch (itemStatus) {
      case "Registered":
        return (
          <span className="badge rounded-pill bg-info-subtle text-info-emphasis px-3 py-2">
            {t("admin.registered")}
          </span>
        );
      case "Pending Verification":
        return (
          <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2">
            {t("admin.pendingVerification")}
          </span>
        );
      case "Accepted":
        return (
          <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
            {t("admin.accepted")}
          </span>
        );
      case "Rejected":
        return (
          <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
            {t("admin.rejected")}
          </span>
        );
      default:
        return (
          <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
            {itemStatus || "-"}
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <AdminLayout title={t("admin.applications")}>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">{t("admin.registrationsApps")}</h3>
          <p className="text-muted mb-0">{t("admin.reviewHint")}</p>
        </div>
        <span className="badge bg-dark rounded-pill px-3 py-2">
          {applications.length} {t("admin.records")}
        </span>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleSearch}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-lg-5">
                <label className="form-label fw-semibold">
                  {t("common.search")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("admin.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <label className="form-label fw-semibold">
                  {t("admin.status")}
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => {
                    const next = e.target.value;
                    setStatus(next);
                    navigate(
                      next
                        ? `/admin/applications?status=${encodeURIComponent(next)}`
                        : "/admin/applications"
                    );
                  }}
                >
                  <option value="">{t("admin.allStatus")}</option>
                  <option value="Registered">{t("admin.registered")}</option>
                  <option value="Pending Verification">
                    {t("admin.pendingVerification")}
                  </option>
                  <option value="Accepted">{t("admin.accepted")}</option>
                  <option value="Rejected">{t("admin.rejected")}</option>
                </select>
              </div>

              <div className="col-12 col-sm-6 col-lg-2">
                <button
                  type="submit"
                  className="btn text-white w-100"
                  style={{ background: "var(--A, #07183d)" }}
                >
                  {t("common.search")}
                </button>
              </div>

              <div className="col-12 col-lg-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  {t("common.clear")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="py-3">{t("admin.registrationId")}</th>
                  <th className="py-3">{t("admin.applicant")}</th>
                  <th className="py-3">{t("admin.mobile")}</th>
                  <th className="py-3">{t("admin.villageCity")}</th>
                  <th className="py-3">{t("common.language")}</th>
                  <th className="py-3 text-center">{t("admin.waheguruCount")}</th>
                  <th className="py-3">{t("admin.submissionDate")}</th>
                  <th className="py-3">{t("admin.status")}</th>
                  <th className="py-3 text-center">{t("admin.action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <div className="spinner-border" role="status" />
                      <div className="text-muted mt-3">{t("common.loading")}</div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  applications.map((item, index) => (
                    <tr key={item._id}>
                      <td className="px-4 text-muted">{index + 1}</td>
                      <td className="fw-semibold">{item.registration_id}</td>
                      <td>
                        <div className="fw-semibold">{item.full_name}</div>
                        {item.email && (
                          <small className="text-muted">{item.email}</small>
                        )}
                      </td>
                      <td>{item.mobile_number}</td>
                      <td>{item.village_city || "-"}</td>
                      <td>
                        {item.preferred_language === "pa"
                          ? t("common.punjabi")
                          : t("common.english")}
                      </td>
                      <td className="text-center fw-bold">
                        {item.submitted_count ?? "-"}
                      </td>
                      <td>{formatDate(item.submission_date)}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td className="text-center">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            title={t("admin.view")}
                            onClick={() =>
                              navigate(`/admin/applications/${item._id}`)
                            }
                          >
                            <i className="bi bi-eye-fill" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            title={t("admin.edit")}
                            onClick={() =>
                              navigate(`/admin/applications/${item._id}/edit`)
                            }
                          >
                            <i className="bi bi-pencil-square" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && applications.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">
                      {t("admin.noRecords")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
