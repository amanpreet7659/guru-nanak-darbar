import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/applications?limit=10000",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch applications."
        );
      }

      const applications = data?.data || [];

      setStats({
        approved: applications.filter(
          (item) => item.status === "Approved"
        ).length,

        pending: applications.filter(
          (item) => item.status === "Pending Verification"
        ).length,

        accepted: applications.filter(
          (item) => item.status === "Accepted"
        ).length,

        rejected: applications.filter(
          (item) => item.status === "Rejected"
        ).length,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Dashboard",
        text:
          error?.message ||
          "Something went wrong while loading dashboard.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const cards = [
    {
      title: "Approved Applications",
      count: stats.approved,
      icon: "bi bi-check-circle-fill",
      className: "text-success",
      bgClass: "bg-success-subtle",
      status: "Approved",
    },
    {
      title: "Pending Applications",
      count: stats.pending,
      icon: "bi bi-hourglass-split",
      className: "text-warning",
      bgClass: "bg-warning-subtle",
      status: "Pending Verification",
    },
    {
      title: "Accepted Applications",
      count: stats.accepted,
      icon: "bi bi-person-check-fill",
      className: "text-primary",
      bgClass: "bg-primary-subtle",
      status: "Accepted",
    },
    {
      title: "Rejected Applications",
      count: stats.rejected,
      icon: "bi bi-x-circle-fill",
      className: "text-danger",
      bgClass: "bg-danger-subtle",
      status: "Rejected",
    },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-dark text-white shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                Admin Dashboard
              </h4>

              <small className="text-white-50">
                Waheguru Simran Program
              </small>
            </div>

            <button
              type="button"
              className="btn btn-outline-light"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="container-fluid px-4 py-4">
        <div className="mb-4">
          <h3 className="fw-bold mb-1">
            Dashboard Overview
          </h3>

          <p className="text-muted mb-0">
            Manage and review Waheguru Simran registrations.
          </p>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {cards.map((card) => (
            <div
              className="col-12 col-sm-6 col-xl-3"
              key={card.title}
            >
              <div
                className="card border-0 shadow-sm h-100"
                style={{
                  borderRadius: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() =>
                  navigate(
                    `/admin/applications?status=${encodeURIComponent(
                      card.status
                    )}`
                  )
                }
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted mb-2">
                        {card.title}
                      </p>

                      <h2 className="fw-bold mb-0">
                        {loading ? "..." : card.count}
                      </h2>
                    </div>

                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center ${card.bgClass}`}
                      style={{
                        width: "52px",
                        height: "52px",
                      }}
                    >
                      <i
                        className={`${card.icon} ${card.className}`}
                        style={{
                          fontSize: "24px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <span
                      className={`small fw-semibold ${card.className}`}
                    >
                      View Applications
                      <i className="bi bi-arrow-right ms-2" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Applications Button */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h5 className="fw-bold mb-1">
                  Waheguru Simran Applications
                </h5>

                <p className="text-muted mb-0">
                  View, verify and manage all submitted
                  applications.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-dark px-4"
                onClick={() =>
                  navigate("/admin/applications")
                }
              >
                <i className="bi bi-list-ul me-2" />
                View All Applications
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;