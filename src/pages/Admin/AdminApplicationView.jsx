import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "./AdminLayout";
import { useTranslation } from "../../i18n";

const AdminApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isEditMode = location.pathname.endsWith("/edit");
  const [application, setApplication] = useState(null);
  const [verifiedCount, setVerifiedCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch application.");
      }

      setApplication(data.data);

      if (
        data.data.verified_count !== null &&
        data.data.verified_count !== undefined
      ) {
        setVerifiedCount(String(data.data.verified_count));
      } else if (data.data.submitted_count != null) {
        setVerifiedCount(String(data.data.submitted_count));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStatus = async ({ status, notes }) => {
    if (status === "Accepted") {
      if (verifiedCount === "" || Number(verifiedCount) < 0) {
        Swal.fire({
          icon: "warning",
          title: t("admin.verifiedCountRequired"),
          text: t("admin.verifiedCountRequiredText"),
        });
        return;
      }
    }

    const tokens =
      status === "Accepted"
        ? Math.floor(Number(verifiedCount) / 1000)
        : undefined;

    setUpdating(true);

    try {
      const body = { status };

      if (status === "Accepted") {
        body.verified_count = Number(verifiedCount);
        body.tokens_issued = tokens;
      }

      if (notes !== undefined) {
        body.notes = notes;
      }

      const response = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || t("admin.updateFailed"));
      }

      await Swal.fire({
        icon: "success",
        title: t("admin.updated"),
        text: data.message || t("admin.applicationUpdated"),
      });

      setApplication(data.data);

      if (
        data.data.verified_count !== null &&
        data.data.verified_count !== undefined
      ) {
        setVerifiedCount(String(data.data.verified_count));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("admin.updateFailed"),
        text: error.message,
      });
    } finally {
      setUpdating(false);
    }
  };

  const acceptApplication = async () => {
    const tokens = Math.floor(Number(verifiedCount) / 1000);

    const confirmation = await Swal.fire({
      icon: "question",
      title:
        application.status === "Accepted"
          ? t("admin.updateAcceptedApplication")
          : t("admin.acceptApplication"),
      html: `
        <div>
          <p><strong>${t("admin.verifiedCountLabel")}:</strong> ${verifiedCount}</p>
          <p><strong>${t("admin.tokensIssued")}:</strong> ${tokens}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText:
        application.status === "Accepted"
          ? t("admin.saveChanges")
          : t("admin.accept"),
      cancelButtonText: t("admin.cancel"),
      confirmButtonColor: "#198754",
    });

    if (!confirmation.isConfirmed) return;

    await updateStatus({ status: "Accepted" });
  };

  const rejectApplication = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title:
        application.status === "Accepted"
          ? t("admin.rejectAcceptedApplication")
          : t("admin.rejectApplication"),
      input: "textarea",
      inputLabel: t("admin.rejectionReason"),
      inputPlaceholder: t("admin.enterRejectionReason"),
      showCancelButton: true,
      confirmButtonText: t("admin.reject"),
      cancelButtonText: t("admin.cancel"),
      confirmButtonColor: "#dc3545",
      inputValidator: (value) => {
        if (!value?.trim()) {
          return t("admin.rejectionReasonRequired");
        }
        return null;
      },
    });

    if (!result.isConfirmed) return;

    await updateStatus({
      status: "Rejected",
      notes: result.value,
    });
  };

  if (loading) {
    return (
      <AdminLayout title={t("admin.applications")}>
        <div className="py-5 text-center">{t("common.loading")}</div>
      </AdminLayout>
    );
  }

  if (!application) {
    return (
      <AdminLayout title={t("admin.applications")}>
        <div className="py-5 text-center">
          {t("admin.applicationNotFound")}
        </div>
      </AdminLayout>
    );
  }

  const calculatedTokens =
    verifiedCount === "" ? 0 : Math.floor(Number(verifiedCount) / 1000);

  const canManage =
    isEditMode &&
    ["Pending Verification", "Accepted", "Rejected"].includes(
      application.status
    );

  return (
    <AdminLayout
      title={
        isEditMode
          ? `${t("admin.applicationDetails")} · ${t("admin.edit")}`
          : `${t("admin.applicationDetails")} · ${t("admin.view")}`
      }
    >
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/applications")}
        >
          {t("admin.backToList")}
        </button>

        {isEditMode ? (
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={() => navigate(`/admin/applications/${id}`)}
          >
            <i className="bi bi-eye me-1" />
            {t("admin.viewMode")}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate(`/admin/applications/${id}/edit`)}
          >
            <i className="bi bi-pencil-square me-1" />
            {t("admin.editMode")}
          </button>
        )}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h3 className="fw-bold mb-1">{application.full_name}</h3>
              <div className="text-muted">
                {application.registration_id} · {t("admin.programLabel")}{" "}
                {application.program_year}
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge rounded-pill px-3 py-2 ${
                  isEditMode ? "bg-primary" : "bg-secondary"
                }`}
              >
                {isEditMode ? t("admin.editMode") : t("admin.viewMode")}
              </span>
              <span className="badge bg-dark rounded-pill px-3 py-2">
                {application.status}
              </span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">{t("admin.applicantSection")}</h5>
              <p>
                <strong>{t("admin.mobile")}:</strong>{" "}
                {application.mobile_number}
              </p>
              <p>
                <strong>{t("admin.whatsapp")}:</strong>{" "}
                {application.whatsapp_number || "-"}
              </p>
              <p>
                <strong>{t("admin.email")}:</strong> {application.email || "-"}
              </p>
              <p>
                <strong>{t("register.preferredLanguage")}:</strong>{" "}
                {application.preferred_language === "pa"
                  ? t("common.punjabi")
                  : t("common.english")}
              </p>
              <p>
                <strong>{t("admin.fatherHusband")}:</strong>{" "}
                {application.father_husband_name || "-"}
              </p>
              <p>
                <strong>{t("admin.villageCity")}:</strong>{" "}
                {application.village_city}
              </p>
              <p>
                <strong>{t("admin.address")}:</strong>{" "}
                {application.address || "-"}
              </p>
              <p>
                <strong>{t("admin.ageGender")}:</strong>{" "}
                {application.age || "-"} / {application.gender || "-"}
              </p>
              <p className="mb-0">
                <strong>{t("admin.pincode")}:</strong>{" "}
                {application.pincode || "-"}
              </p>
            </div>

            <div className="col-md-6">
              <h5 className="fw-bold mb-3">{t("admin.simranSection")}</h5>
              <p>
                <strong>{t("admin.copiesSubmitted")}:</strong>{" "}
                {application.copies_submitted ?? "-"}
              </p>
              <p>
                <strong>{t("admin.submittedCount")}:</strong>{" "}
                {application.submitted_count ?? "-"}
              </p>
              <p>
                <strong>{t("admin.submissionDate")}:</strong>{" "}
                {application.submission_date || "-"}
              </p>
              <p>
                <strong>{t("admin.notes")}:</strong> {application.notes || "-"}
              </p>
              <p>
                <strong>{t("admin.verifiedCountLabel")}:</strong>{" "}
                {application.verified_count ?? "-"}
              </p>
              <p className="mb-0">
                <strong>{t("admin.tokensIssued")}:</strong>{" "}
                {application.tokens_issued ?? "-"}
              </p>
            </div>
          </div>

          {canManage && (
            <>
              <hr className="my-4" />
              <h5 className="fw-bold mb-3">{t("admin.verification")}</h5>

              {application.status === "Accepted" && (
                <div className="alert alert-success py-2">
                  {t("admin.acceptedEditHint")}
                </div>
              )}

              {application.status === "Rejected" && (
                <div className="alert alert-danger py-2">
                  {t("admin.rejectedEditHint")}
                </div>
              )}

              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    {t("admin.verifiedCount")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={verifiedCount}
                    onChange={(e) => setVerifiedCount(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <div className="text-muted small">
                    {t("admin.estimatedTokens")}
                  </div>
                  <div className="fs-3 fw-bold">{calculatedTokens}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={updating}
                  onClick={acceptApplication}
                >
                  {application.status === "Accepted"
                    ? t("admin.saveChanges")
                    : t("admin.accept")}
                </button>

                {application.status !== "Rejected" && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={updating}
                    onClick={rejectApplication}
                  >
                    {t("admin.reject")}
                  </button>
                )}

                {application.status === "Rejected" && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    disabled={updating}
                    onClick={rejectApplication}
                  >
                    {t("admin.updateRejectionReason")}
                  </button>
                )}
              </div>
            </>
          )}

          {!isEditMode &&
            ["Pending Verification", "Accepted", "Rejected"].includes(
              application.status
            ) && (
              <div className="alert alert-light border mt-4 mb-0">
                {t("admin.viewModeHintPrefix")}{" "}
                <button
                  type="button"
                  className="btn btn-link p-0 align-baseline"
                  onClick={() => navigate(`/admin/applications/${id}/edit`)}
                >
                  {t("admin.edit")}
                </button>{" "}
                {t("admin.viewModeHintSuffix")}
              </div>
            )}

          {application.status === "Registered" && (
            <div className="alert alert-info mt-4 mb-0">
              {t("admin.registeredOnlyHint")}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplicationView;
