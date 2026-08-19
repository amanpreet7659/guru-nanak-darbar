import React, {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Swal from "sweetalert2";

const AdminApplications = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialStatus =
    searchParams.get("status") || "";

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState(initialStatus);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
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
        throw new Error(
          data?.message ||
            "Failed to fetch applications."
        );
      }

      setApplications(
        data?.data || []
      );
    } catch (error) {
      console.error(
        "Applications error:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Unable to Load",
        text:
          error?.message ||
          "Failed to load applications.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();

    fetchApplications();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  const getStatusBadge = (itemStatus) => {
    switch (itemStatus) {
      case "Approved":
        return (
          <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
            <i className="bi bi-check-circle-fill me-1" />
            Approved
          </span>
        );

      case "Pending Verification":
        return (
          <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2">
            <i className="bi bi-hourglass-split me-1" />
            Pending
          </span>
        );

      case "Accepted":
        return (
          <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2">
            <i className="bi bi-person-check-fill me-1" />
            Accepted
          </span>
        );

      case "Rejected":
        return (
          <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
            <i className="bi bi-x-circle-fill me-1" />
            Rejected
          </span>
        );

      default:
        return (
          <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2">
            {itemStatus || "Unknown"}
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "#f5f7fb",
      }}
    >
      {/* ================= HEADER ================= */}

      <header
        className="text-white shadow-sm"
        style={{
          background:
            "var(--A, #07183d)",
        }}
      >
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            {/* Left */}

            <div>
              <h4 className="mb-1 fw-bold">
                Applications
              </h4>

              <small
                style={{
                  color:
                    "rgba(255,255,255,0.7)",
                }}
              >
                Waheguru Simran Program
              </small>
            </div>

            {/* Right */}

            <button
              type="button"
              className="btn btn-light d-flex align-items-center gap-2 px-3"
              onClick={() =>
                navigate("/admin")
              }
            >
              <i className="bi bi-grid-1x2-fill" />

              <span>
                Dashboard
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="container-fluid px-4 py-4">
        {/* Page Heading */}

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h3 className="fw-bold mb-1">
              Registration Applications
            </h3>

            <p className="text-muted mb-0">
              Review and manage Waheguru Simran
              registrations.
            </p>
          </div>

          <div>
            <span className="badge bg-dark rounded-pill px-3 py-2">
              {applications.length} Applications
            </span>
          </div>
        </div>

        {/* ================= FILTER CARD ================= */}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-end">
                {/* Search */}

                <div className="col-12 col-lg-5">
                  <label className="form-label fw-semibold">
                    Search
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search text-muted" />
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name, mobile or registration ID"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* Status */}

                <div className="col-12 col-sm-6 col-lg-3">
                  <label className="form-label fw-semibold">
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      All Status
                    </option>

                    <option value="Pending Verification">
                      Pending Verification
                    </option>

                    <option value="Approved">
                      Approved
                    </option>

                    <option value="Accepted">
                      Accepted
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>

                {/* Search Button */}

                <div className="col-12 col-sm-6 col-lg-2">
                  <button
                    type="submit"
                    className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background:
                        "var(--A, #07183d)",
                    }}
                  >
                    <i className="bi bi-search" />
                    Search
                  </button>
                </div>

                {/* Clear */}

                <div className="col-12 col-lg-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={
                      clearFilters
                    }
                  >
                    <i className="bi bi-arrow-counterclockwise" />
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ================= TABLE CARD ================= */}

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">
                  All Applications
                </h5>

                <small className="text-muted">
                  Latest registrations are shown
                  first.
                </small>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={
                  fetchApplications
                }
                disabled={loading}
              >
                <i
                  className={`bi ${
                    loading
                      ? "bi-arrow-repeat"
                      : "bi-arrow-clockwise"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead
                  style={{
                    background: "#f8f9fa",
                  }}
                >
                  <tr>
                    <th className="px-4 py-3 text-nowrap">
                      #
                    </th>

                    <th className="py-3 text-nowrap">
                      Registration ID
                    </th>

                    <th className="py-3 text-nowrap">
                      Applicant
                    </th>

                    <th className="py-3 text-nowrap">
                      Mobile
                    </th>

                    <th className="py-3 text-nowrap">
                      Village / City
                    </th>

                    <th className="py-3 text-nowrap text-center">
                      Waheguru Count
                    </th>

                    <th className="py-3 text-nowrap">
                      Submission Date
                    </th>

                    <th className="py-3 text-nowrap">
                      Status
                    </th>

                    <th className="py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Loading */}

                  {loading && (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-5"
                      >
                        <div
                          className="spinner-border"
                          role="status"
                          style={{
                            color:
                              "var(--A, #07183d)",
                          }}
                        />

                        <div className="text-muted mt-3">
                          Loading applications...
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Data */}

                  {!loading &&
                    applications.map(
                      (item, index) => (
                        <tr
                          key={item._id}
                        >
                          <td className="px-4 text-muted">
                            {index + 1}
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {
                                item.registration_id
                              }
                            </span>
                          </td>

                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{
                                  width:
                                    "38px",
                                  height:
                                    "38px",
                                  minWidth:
                                    "38px",
                                  background:
                                    "var(--A, #07183d)",
                                }}
                              >
                                {item.full_name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}
                              </div>

                              <div>
                                <div className="fw-semibold">
                                  {
                                    item.full_name
                                  }
                                </div>

                                {item.email && (
                                  <small className="text-muted">
                                    {
                                      item.email
                                    }
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="text-nowrap">
                            <i className="bi bi-telephone me-2 text-muted" />

                            {
                              item.mobile_number
                            }
                          </td>

                          <td>
                            {
                              item.village_city ||
                              "-"
                            }
                          </td>

                          <td className="text-center">
                            <span className="fw-bold">
                              {
                                item.submitted_count
                              }
                            </span>
                          </td>

                          <td className="text-nowrap">
                            {
                              formatDate(
                                item.submission_date
                              )
                            }
                          </td>

                          <td>
                            {getStatusBadge(
                              item.status
                            )}
                          </td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-dark rounded-circle d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: "36px",
                                height: "36px",
                              }}
                              title="View Application"
                              onClick={() =>
                                navigate(
                                  `/admin/applications/${item._id}`
                                )
                              }
                            >
                              <i className="bi bi-eye-fill" />
                            </button>
                          </td>
                        </tr>
                      )
                    )}

                  {/* Empty */}

                  {!loading &&
                    applications.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-5"
                        >
                          <div
                            className="mb-3"
                            style={{
                              fontSize:
                                "42px",
                              color: "#adb5bd",
                            }}
                          >
                            <i className="bi bi-inbox" />
                          </div>

                          <h6 className="fw-bold">
                            No Applications Found
                          </h6>

                          <p className="text-muted mb-0">
                            No registrations match
                            your current filters.
                          </p>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminApplications;