import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const initialForm = {
  program_year: new Date().getFullYear(),
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
  copies_submitted: "",
  submitted_count: "",
  submission_date: new Date().toISOString().split("T")[0],
  notes: "",
};

const calculateTokens = (count) => {
  const value = Number(count) || 0;
  return Math.floor(value / 1000);
};

const FieldError = ({ message }) => {
  if (!message) return null;

  return <div className="invalid-feedback d-block">{message}</div>;
};

export default function WaheguruSimranRegistration() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const navigate = useNavigate();

  const estimatedTokens = useMemo(
    () => calculateTokens(form.submitted_count),
    [form.submitted_count],
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

    setSuccessData(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
    }

    if (!form.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required.";
    } else if (!/^[0-9]{10}$/.test(form.mobile_number.trim())) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number.";
    }

    if (!form.village_city.trim()) {
      newErrors.village_city = "Village / City is required.";
    }

    if (!form.copies_submitted) {
      newErrors.copies_submitted = "Number of copies submitted is required.";
    } else if (Number(form.copies_submitted) < 1) {
      newErrors.copies_submitted = "Copies submitted must be at least 1.";
    }

    if (!form.submitted_count) {
      newErrors.submitted_count = "Total Waheguru count is required.";
    } else if (Number(form.submitted_count) < 1) {
      newErrors.submitted_count = "Waheguru count must be greater than 0.";
    }

    if (!form.submission_date) {
      newErrors.submission_date = "Submission date is required.";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      form.whatsapp_number &&
      !/^[0-9]{10}$/.test(form.whatsapp_number.trim())
    ) {
      newErrors.whatsapp_number =
        "Please enter a valid 10-digit WhatsApp number.";
    }

    if (form.pincode && !/^[0-9]{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = "Please enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      program_year: new Date().getFullYear(),
      submission_date: new Date().toISOString().split("T")[0],
    });

    setErrors({});
    setSuccessData(null);
  };

  const mockSubmitWaheguruRegistration = async (payload) => {
    const response = await fetch("/api/waheguru-simran/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text:
          data?.message ||
          "Your Waheguru Simran registration has been submitted successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f3c68",
      });
      resetForm();
      navigate("/");
    }

    if (!response.ok) {
      await Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text:
          data?.message ||
          "There was an error submitting your Waheguru Simran registration.",
        confirmButtonText: "OK",
        confirmButtonColor: "#1f3c68",
      });
      throw new Error(data?.message || "Registration failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSubmitting(true);
    setSuccessData(null);

    const payload = {
      program_year: Number(form.program_year),

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

      copies_submitted: Number(form.copies_submitted),

      // User submitted count
      submitted_count: Number(form.submitted_count),

      submission_date: form.submission_date,

      notes: form.notes.trim(),

      // Informational only.
      // Final token calculation should happen
      // after admin verification.
      estimated_tokens: calculateTokens(form.submitted_count),

      verified_count: null,
      tokens_issued: null,

      status: "Pending Verification",
    };

    try {
      /*
       * MOCK API
       *
       * Later:
       *
       * const response = await axios.post(
       *     '/api/waheguru-simran/register',
       *     payload
       * );
       *
       */

      const response = await mockSubmitWaheguruRegistration(payload);

      if (response?.success) {
        setSuccessData(response.data);

        resetForm();

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Waheguru registration error:", error);

      setErrors({
        submit: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* PAGE HEADER */}

      <div className="text-center mb-5">
        <div
          className="fw-semibold mb-2"
          style={{
            color: "#173ca5",
            letterSpacing: "1px",
            fontSize: "14px",
          }}
        >
          ANNUAL PROGRAM
        </div>

        <h1
          className="fw-semibold mb-3"
          style={{
            color: "#071a41",
          }}
        >
          Waheguru Simran Seva Registration
        </h1>

        <p
          className="text-muted mx-auto"
          style={{
            maxWidth: "720px",
            lineHeight: 1.7,
          }}
        >
          Register your participation and submit the number of times you have
          written “Waheguru” as part of our annual Simran Seva.
        </p>
      </div>

      {/* SUCCESS */}

      {successData && (
        <div className="alert alert-success mb-4" role="alert">
          <div className="d-flex gap-3 align-items-start">
            <div
              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 35,
                height: 35,
                fontWeight: 700,
              }}
            >
              ✓
            </div>

            <div>
              <h5 className="mb-1">Registration Submitted Successfully</h5>

              <div>
                Registration ID: <strong>{successData.registration_id}</strong>
              </div>

              <small>
                Your submitted count will be verified before final tokens are
                issued.
              </small>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT ERROR */}

      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* PARTICIPANT INFORMATION */}

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
                <h4 className="mb-1">Participant Information</h4>

                <p className="text-muted mb-0 small">
                  Enter your basic information.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* FULL NAME */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Full Name <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.full_name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter full name"
                />

                <FieldError message={errors.full_name} />
              </div>

              {/* FATHER / HUSBAND */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Father / Husband Name
                </label>

                <input
                  type="text"
                  name="father_husband_name"
                  value={form.father_husband_name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter father / husband name"
                />
              </div>

              {/* MOBILE */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Mobile Number <span className="text-danger">*</span>
                </label>

                <input
                  type="tel"
                  name="mobile_number"
                  value={form.mobile_number}
                  onChange={handleChange}
                  maxLength={10}
                  className={`form-control ${
                    errors.mobile_number ? "is-invalid" : ""
                  }`}
                  placeholder="10-digit mobile number"
                />

                <FieldError message={errors.mobile_number} />
              </div>

              {/* WHATSAPP */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  WhatsApp Number
                </label>

                <input
                  type="tel"
                  name="whatsapp_number"
                  value={form.whatsapp_number}
                  onChange={handleChange}
                  maxLength={10}
                  className={`form-control ${
                    errors.whatsapp_number ? "is-invalid" : ""
                  }`}
                  placeholder="WhatsApp number"
                />

                <FieldError message={errors.whatsapp_number} />
              </div>

              {/* EMAIL */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="example@email.com"
                />

                <FieldError message={errors.email} />
              </div>

              {/* VILLAGE CITY */}

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Village / City <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  name="village_city"
                  value={form.village_city}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.village_city ? "is-invalid" : ""
                  }`}
                  placeholder="Enter village / city"
                />

                <FieldError message={errors.village_city} />
              </div>

              {/* ADDRESS */}

              <div className="col-12">
                <label className="form-label fw-semibold">Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>

              {/* AGE */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Age</label>

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="form-control"
                  placeholder="Age"
                />
              </div>

              {/* GENDER */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Gender</label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* PINCODE */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`form-control ${
                    errors.pincode ? "is-invalid" : ""
                  }`}
                  placeholder="6-digit pincode"
                />

                <FieldError message={errors.pincode} />
              </div>
            </div>
          </div>
        </div>

        {/* SIMRAN DETAILS */}

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
                <h4 className="mb-1">Simran Submission Details</h4>

                <p className="text-muted mb-0 small">
                  Provide your Waheguru Simran writing details.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* PROGRAM YEAR */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Program Year <span className="text-danger">*</span>
                </label>

                <select
                  name="program_year"
                  value={form.program_year}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="2026">2026</option>

                  <option value="2027">2027</option>

                  <option value="2028">2028</option>
                </select>
              </div>

              {/* COPIES */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Copies Submitted <span className="text-danger">*</span>
                </label>

                <input
                  type="number"
                  name="copies_submitted"
                  value={form.copies_submitted}
                  onChange={handleChange}
                  min="1"
                  className={`form-control ${
                    errors.copies_submitted ? "is-invalid" : ""
                  }`}
                  placeholder="e.g. 5"
                />

                <FieldError message={errors.copies_submitted} />
              </div>

              {/* DATE */}

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold">
                  Submission Date <span className="text-danger">*</span>
                </label>

                <input
                  type="date"
                  name="submission_date"
                  value={form.submission_date}
                  onChange={handleChange}
                  className={`form-control ${
                    errors.submission_date ? "is-invalid" : ""
                  }`}
                />

                <FieldError message={errors.submission_date} />
              </div>

              {/* COUNT */}

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
                        Total “Waheguru” Written{" "}
                        <span className="text-danger">*</span>
                      </label>

                      <input
                        type="number"
                        name="submitted_count"
                        value={form.submitted_count}
                        onChange={handleChange}
                        min="1"
                        className={`form-control form-control-lg ${
                          errors.submitted_count ? "is-invalid" : ""
                        }`}
                        placeholder="Enter total Waheguru count"
                      />

                      <FieldError message={errors.submitted_count} />

                      <small className="text-muted">
                        1 token is eligible for every complete 1,000 Waheguru
                        writings.
                      </small>
                    </div>

                    {/* TOKEN PREVIEW */}

                    <div className="col-12 col-lg-5">
                      <div
                        className="bg-white rounded-4 text-center p-4"
                        style={{
                          border: "1px solid #e1e6ef",
                        }}
                      >
                        <div className="text-muted small fw-semibold">
                          Estimated Eligible Tokens
                        </div>

                        <div
                          className="fw-bold"
                          style={{
                            fontSize: 45,
                            color: "#173ca5",
                          }}
                        >
                          {estimatedTokens}
                        </div>

                        <small className="text-muted">
                          Final tokens after verification
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTES */}

              <div className="col-12">
                <label className="form-label fw-semibold">
                  Additional Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION INFO */}

        <div className="alert alert-light border rounded-4 mb-4">
          <div className="d-flex gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 30,
                height: 30,
                background: "#eaf0ff",
                color: "#173ca5",
                fontWeight: 700,
              }}
            >
              i
            </div>

            <div>
              <div className="fw-semibold mb-1">Token Verification</div>

              <div className="small text-muted">
                Your submitted Waheguru count will be verified by the program
                team. Final tokens will be issued based on the verified count.
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="d-flex justify-content-end gap-2 pb-5">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={resetForm}
            disabled={submitting}
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn px-5 text-white"
            disabled={submitting}
            style={{
              background: "#071a41",
            }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
