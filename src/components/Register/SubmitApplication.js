import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "../../i18n";

const calculateTokens = (count) => {
  const value = Number(count) || 0;
  return Math.floor(value / 1000);
};

const FieldError = ({ message }) => {
  if (!message) return null;
  return <div className="invalid-feedback d-block">{message}</div>;
};

export default function WaheguruSimranSubmit() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    program_year: 2026,
    user_id: "",
    copies_submitted: "",
    submitted_count: "",
    submission_date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const estimatedTokens = useMemo(
    () => calculateTokens(form.submitted_count),
    [form.submitted_count]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    const userId = form.user_id.trim();

    if (!userId) {
      newErrors.user_id = t("submit.userIdRequired");
    } else if (userId.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userId)) {
        newErrors.user_id = t("submit.userIdEmailInvalid");
      }
    } else if (!/^[0-9]{10}$/.test(userId)) {
      newErrors.user_id = t("submit.userIdMobileInvalid");
    }

    if (!form.copies_submitted) {
      newErrors.copies_submitted = t("submit.copiesRequired");
    } else if (Number(form.copies_submitted) < 1) {
      newErrors.copies_submitted = t("submit.copiesMin");
    }

    if (!form.submitted_count) {
      newErrors.submitted_count = t("submit.countRequired");
    } else if (Number(form.submitted_count) < 1) {
      newErrors.submitted_count = t("submit.countMin");
    }

    if (!form.submission_date) {
      newErrors.submission_date = t("submit.dateRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      program_year: 2026,
      user_id: "",
      copies_submitted: "",
      submitted_count: "",
      submission_date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const payload = {
      program_year: Number(form.program_year) || 2026,
      user_id: form.user_id.trim(),
      copies_submitted: Number(form.copies_submitted),
      submitted_count: Number(form.submitted_count),
      submission_date: form.submission_date,
      notes: form.notes.trim(),
    };

    try {
      const response = await fetch("/api/waheguru-simran/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        await Swal.fire({
          icon: "error",
          title: t("submit.failTitle"),
          text: data?.message || t("register.somethingWrong"),
          confirmButtonColor: "#1f3c68",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: t("submit.successTitle"),
        html: `
          <p>${data?.message || ""}</p>
          <p><strong>${t("register.registrationId")}:</strong> ${data?.data?.registration_id || ""}</p>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#1f3c68",
      });

      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Waheguru submit error:", error);
      setErrors({
        submit: t("register.somethingWrong"),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div
          className="fw-semibold mb-2"
          style={{
            color: "#173ca5",
            letterSpacing: "1px",
            fontSize: "14px",
          }}
        >
          {t("submit.step")}
        </div>

        <h1 className="fw-semibold mb-3" style={{ color: "#071a41" }}>
          {t("submit.title")}
        </h1>

        <p
          className="text-muted mx-auto"
          style={{ maxWidth: "720px", lineHeight: 1.7 }}
        >
          {t("submit.intro")}
        </p>
      </div>

      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex gap-3 align-items-center mb-4 pb-3 border-bottom">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: 45,
                  height: 45,
                  background: "#eaf0ff",
                  color: "#173ca5",
                }}
              >
                02
              </div>
              <div>
                <h4 className="mb-1">{t("submit.details")}</h4>
                <p className="text-muted mb-0 small">
                  {t("submit.notRegistered")}{" "}
                  <Link to="/waheguru-simran/register">
                    {t("submit.startLink")}
                  </Link>
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("submit.userId")} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  className={`form-control ${errors.user_id ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.user_id} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("submit.programYear")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  name="program_year"
                  value={form.program_year}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="2026">2026</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("submit.copies")} <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="copies_submitted"
                  value={form.copies_submitted}
                  onChange={handleChange}
                  min="1"
                  className={`form-control ${errors.copies_submitted ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.copies_submitted} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("submit.submissionDate")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="submission_date"
                  value={form.submission_date}
                  onChange={handleChange}
                  className={`form-control ${errors.submission_date ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.submission_date} />
              </div>

              <div className="col-12">
                <div
                  className="rounded-4 p-4"
                  style={{
                    background: "#f5f8ff",
                    border: "1px solid #dfe7fb",
                  }}
                >
                  <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-7">
                      <label className="form-label fw-semibold">
                        {t("submit.totalWritten")}{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="submitted_count"
                        value={form.submitted_count}
                        onChange={handleChange}
                        min="1"
                        className={`form-control form-control-lg ${errors.submitted_count ? "is-invalid" : ""}`}
                      />
                      <FieldError message={errors.submitted_count} />
                      <small className="text-muted">
                        {t("submit.tokenHint")}
                      </small>
                    </div>

                    <div className="col-12 col-lg-5">
                      <div
                        className="bg-white rounded-4 text-center p-4"
                        style={{ border: "1px solid #e1e6ef" }}
                      >
                        <div className="text-muted small fw-semibold">
                          {t("submit.estimatedTokens")}
                        </div>
                        <div
                          className="fw-bold"
                          style={{ fontSize: 45, color: "#173ca5" }}
                        >
                          {estimatedTokens}
                        </div>
                        <small className="text-muted">
                          {t("submit.finalTokens")}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {t("submit.notes")}
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 pb-5">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={resetForm}
            disabled={submitting}
          >
            {t("common.reset")}
          </button>
          <button
            type="submit"
            className="btn px-5 text-white"
            disabled={submitting}
            style={{ background: "#071a41" }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                {t("submit.submitting")}
              </>
            ) : (
              t("submit.submitBtn")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
