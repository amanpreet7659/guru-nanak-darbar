import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "./AdminLayout";
import { useTranslation } from "../../i18n";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    submitted: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/applications?limit=10000", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch applications.");
      }

      const applications = data?.data || [];

      const registered = applications.filter(
        (item) => item.status === "Registered"
      ).length;

      const pending = applications.filter(
        (item) => item.status === "Pending Verification"
      ).length;

      const accepted = applications.filter(
        (item) => item.status === "Accepted"
      ).length;

      const rejected = applications.filter(
        (item) => item.status === "Rejected"
      ).length;

      setStats({
        total: applications.length,
        registered,
        submitted: pending + accepted + rejected,
        pending,
        accepted,
        rejected,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);

      Swal.fire({
        icon: "error",
        title: t("admin.dashboard"),
        text: error?.message || t("register.somethingWrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    {
      title: t("admin.totalRegistrations"),
      count: stats.total,
      icon: "bi bi-people-fill",
      className: "text-dark",
      bgClass: "bg-secondary-subtle",
      status: "",
    },
    {
      title: t("admin.registeredOnly"),
      count: stats.registered,
      icon: "bi bi-person-plus-fill",
      className: "text-info",
      bgClass: "bg-info-subtle",
      status: "Registered",
    },
    {
      title: t("admin.applicationsSubmitted"),
      count: stats.submitted,
      icon: "bi bi-file-earmark-text-fill",
      className: "text-primary",
      bgClass: "bg-primary-subtle",
      status: "Pending Verification",
    },
    {
      title: t("admin.pendingApproval"),
      count: stats.pending,
      icon: "bi bi-hourglass-split",
      className: "text-warning",
      bgClass: "bg-warning-subtle",
      status: "Pending Verification",
    },
    {
      title: t("admin.accepted"),
      count: stats.accepted,
      icon: "bi bi-check-circle-fill",
      className: "text-success",
      bgClass: "bg-success-subtle",
      status: "Accepted",
    },
    {
      title: t("admin.rejected"),
      count: stats.rejected,
      icon: "bi bi-x-circle-fill",
      className: "text-danger",
      bgClass: "bg-danger-subtle",
      status: "Rejected",
    },
  ];

  return (
    <AdminLayout title={t("admin.dashboard")}>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">{t("admin.overview")}</h3>
        <p className="text-muted mb-0">{t("admin.overviewHint")}</p>
      </div>

      <div className="row g-4">
        {cards.map((card) => (
          <div className="col-12 col-sm-6 col-xl-4" key={card.title}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() =>
                navigate(
                  card.status
                    ? `/admin/applications?status=${encodeURIComponent(card.status)}`
                    : "/admin/applications"
                )
              }
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-2">{card.title}</p>
                    <h2 className="fw-bold mb-0">
                      {loading ? "..." : card.count}
                    </h2>
                  </div>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${card.bgClass}`}
                    style={{ width: "52px", height: "52px" }}
                  >
                    <i
                      className={`${card.icon} ${card.className}`}
                      style={{ fontSize: "24px" }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`small fw-semibold ${card.className}`}>
                    {t("admin.viewList")}
                    <i className="bi bi-arrow-right ms-2" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
