import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "../../i18n";

const FieldError = ({ message }) => {
  if (!message) return null;
  return <div className="invalid-feedback d-block">{message}</div>;
};

export default function WaheguruSimranRegistration() {
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    program_year: 2026,
    full_name: "",
    father_husband_name: "",
    mobile_number: "",
    whatsapp_number: "",
    email: "",
    village_city: "",
    address: "",
    age: "",
    gender: "",
    pincode: "",
    preferred_language: language,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      preferred_language: language,
    }));
  }, [language]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "preferred_language" && (value === "en" || value === "pa")) {
      setLanguage(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = t("register.fullNameRequired");
    }

    if (!form.mobile_number.trim()) {
      newErrors.mobile_number = t("register.mobileRequired");
    } else if (!/^[0-9]{10}$/.test(form.mobile_number.trim())) {
      newErrors.mobile_number = t("register.mobileInvalid");
    }

    if (!form.village_city.trim()) {
      newErrors.village_city = t("register.villageRequired");
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("register.emailInvalid");
    }

    if (
      form.whatsapp_number &&
      !/^[0-9]{10}$/.test(form.whatsapp_number.trim())
    ) {
      newErrors.whatsapp_number = t("register.whatsappInvalid");
    }

    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = t("register.pincodeInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      program_year: 2026,
      full_name: "",
      father_husband_name: "",
      mobile_number: "",
      whatsapp_number: "",
      email: "",
      village_city: "",
      address: "",
      age: "",
      gender: "",
      pincode: "",
      preferred_language: language,
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
      full_name: form.full_name.trim(),
      father_husband_name: form.father_husband_name.trim(),
      mobile_number: form.mobile_number.trim(),
      whatsapp_number: form.whatsapp_number.trim(),
      email: form.email.trim(),
      village_city: form.village_city.trim(),
      address: form.address.trim(),
      age: form.age ? Number(form.age) : null,
      gender: form.gender,
      pincode: form.pincode.trim(),
      preferred_language: form.preferred_language === "pa" ? "pa" : "en",
      notes: form.notes.trim(),
    };

    try {
      const response = await fetch("/api/waheguru-simran/register", {
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
          title: t("register.failTitle"),
          text: data?.message || t("register.somethingWrong"),
          confirmButtonColor: "#1f3c68",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: t("register.successTitle"),
        html: `
          <p>${data?.message || ""}</p>
          <p><strong>${t("register.registrationId")}:</strong> ${data?.data?.registration_id || ""}</p>
          <p class="mb-0"><strong>${t("register.yourUserId")}:</strong> ${form.mobile_number.trim()}${form.email.trim() ? ` / ${form.email.trim()}` : ""}</p>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#1f3c68",
      });

      resetForm();
      navigate("/waheguru-simran/submit");
    } catch (error) {
      console.error("Waheguru registration error:", error);
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
          {t("register.step")}
        </div>

        <h1 className="fw-semibold mb-3" style={{ color: "#071a41" }}>
          {t("register.title")}
        </h1>

        <p
          className="text-muted mx-auto"
          style={{ maxWidth: "720px", lineHeight: 1.7 }}
        >
          {t("register.intro")}
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
                01
              </div>
              <div>
                <h4 className="mb-1">{t("register.participantInfo")}</h4>
                <p className="text-muted mb-0 small">
                  {t("register.participantHint")}
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.fullName")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.full_name} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.fatherHusband")}
                </label>
                <input
                  type="text"
                  name="father_husband_name"
                  value={form.father_husband_name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.mobileUserId")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  value={form.mobile_number}
                  onChange={handleChange}
                  maxLength={10}
                  className={`form-control ${errors.mobile_number ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.mobile_number} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.whatsapp")}
                </label>
                <input
                  type="tel"
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  maxLength={10}
                  className={`form-control ${errors.whatsapp_number ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.whatsapp_number} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.emailOptional")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.email} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.villageCity")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="village_city"
                  value={form.village_city}
                  onChange={handleChange}
                  className={`form-control ${errors.village_city ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.village_city} />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {t("register.address")}
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  {t("register.age")}
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="form-control"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  {t("register.gender")}
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">{t("register.selectGender")}</option>
                  <option value="Male">{t("register.male")}</option>
                  <option value="Female">{t("register.female")}</option>
                  <option value="Other">{t("register.other")}</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  {t("register.pincode")}
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                />
                <FieldError message={errors.pincode} />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  {t("register.preferredLanguage")}{" "}
                  <span className="text-danger">*</span>
                </label>
                <select
                  name="preferred_language"
                  value={form.preferred_language}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="en">{t("common.english")}</option>
                  <option value="pa">{t("common.punjabi")}</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">
                  {t("register.notes")}
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

        <div className="alert alert-light border rounded-4 mb-4">
          <div className="fw-semibold mb-1">{t("register.nextStep")}</div>
          <div className="small text-muted">{t("register.nextStepHint")}</div>
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
                {t("register.registering")}
              </>
            ) : (
              t("register.complete")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
