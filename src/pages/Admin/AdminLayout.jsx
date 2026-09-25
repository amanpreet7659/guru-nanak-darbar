import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "../../i18n";

const AdminLayout = ({
  title,
  subtitle,
  children,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/admin/login");
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-dark text-white shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div className="min-w-0">
              <h4 className="mb-1 fw-bold text-truncate">
                {title || t("admin.dashboard")}
              </h4>
              <small className="text-white-50">
                {subtitle || t("admin.program")}
              </small>
            </div>

            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <LanguageSwitcher variant="admin" />

              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `btn btn-sm ${
                    isActive ? "btn-light" : "btn-outline-light"
                  }`
                }
              >
                <i className="bi bi-grid-1x2-fill me-1" />
                {t("admin.dashboard")}
              </NavLink>

              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-1" />
                {t("admin.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid px-4 py-4">{children}</main>
    </div>
  );
};

export default AdminLayout;
