import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AdminApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [verifiedCount, setVerifiedCount] = useState("");
  const [loading, setLoading] = useState(true);
  
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
        setVerifiedCount(data.data.verified_count);
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
  }, [id]);

  const approveApplication = async () => {
    if (verifiedCount === "" || Number(verifiedCount) < 0) {
      Swal.fire({
        icon: "warning",
        title: "Verified Count Required",
        text: "Please enter the verified Waheguru count.",
      });

      return;
    }

    const tokens = Math.floor(Number(verifiedCount) / 1000);

    const confirmation = await Swal.fire({
      icon: "question",
      title: "Approve Application?",
      html: `
          <div>
            <p><strong>Verified Count:</strong> ${verifiedCount}</p>
            <p><strong>Tokens:</strong> ${tokens}</p>
          </div>
        `,
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#198754",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          verified_count: Number(verifiedCount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Approval failed.");
      }

      await Swal.fire({
        icon: "success",
        title: "Approved",
        text: data.message,
      });

      fetchApplication();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.message,
      });
    }
  };

  const rejectApplication = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Reject Application",
      input: "textarea",
      inputLabel: "Rejection Reason",
      inputPlaceholder: "Enter rejection reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc3545",
      inputValidator: (value) => {
        if (!value?.trim()) {
          return "Rejection reason is required.";
        }

        return null;
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reason: result.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Rejection failed.");
      }

      await Swal.fire({
        icon: "success",
        title: "Application Rejected",
        text: data.message,
      });

      fetchApplication();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: error.message,
      });
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (!application) {
    return <div style={{ padding: "40px" }}>Application not found.</div>;
  }

  const calculatedTokens =
    verifiedCount === "" ? 0 : Math.floor(Number(verifiedCount) / 1000);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
      }}
    >
      <button onClick={() => navigate("/admin/applications")}>← Back</button>

      <div
        style={{
          background: "#fff",
          padding: "30px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Application Details</h2>

        <hr />

        <h3>Applicant Information</h3>

        <p>
          <strong>Registration ID:</strong> {application.registration_id}
        </p>

        <p>
          <strong>Program Year:</strong> {application.program_year}
        </p>

        <p>
          <strong>Full Name:</strong> {application.full_name}
        </p>

        <p>
          <strong>Father / Husband Name:</strong>{" "}
          {application.father_husband_name || "-"}
        </p>

        <p>
          <strong>Mobile:</strong> {application.mobile_number}
        </p>

        <p>
          <strong>WhatsApp:</strong> {application.whatsapp_number || "-"}
        </p>

        <p>
          <strong>Email:</strong> {application.email || "-"}
        </p>

        <p>
          <strong>Village / City:</strong> {application.village_city}
        </p>

        <p>
          <strong>Address:</strong> {application.address || "-"}
        </p>

        <p>
          <strong>Age:</strong> {application.age || "-"}
        </p>

        <p>
          <strong>Gender:</strong> {application.gender || "-"}
        </p>

        <p>
          <strong>Pincode:</strong> {application.pincode || "-"}
        </p>

        <hr />

        <h3>Simran Information</h3>

        <p>
          <strong>Copies Submitted:</strong> {application.copies_submitted}
        </p>

        <p>
          <strong>Submitted Waheguru Count:</strong>{" "}
          {application.submitted_count}
        </p>

        <p>
          <strong>Submission Date:</strong> {application.submission_date}
        </p>

        <hr />

        <h3>Verification</h3>

        <p>
          <strong>Current Status:</strong> {application.status}
        </p>

        {application.status === "Pending Verification" ? (
          <>
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <label>Verified Waheguru Count</label>

              <input
                type="number"
                min="0"
                value={verifiedCount}
                onChange={(e) => setVerifiedCount(e.target.value)}
                style={{
                  display: "block",
                  marginTop: "8px",
                  padding: "12px",
                  width: "300px",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <strong>Tokens Issued:</strong> {calculatedTokens}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={approveApplication}
                style={{
                  padding: "12px 25px",
                  background: "#198754",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Approve
              </button>

              <button
                onClick={rejectApplication}
                style={{
                  padding: "12px 25px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Reject
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              <strong>Verified Count:</strong>{" "}
              {application.verified_count ?? "-"}
            </p>

            <p>
              <strong>Tokens Issued:</strong> {application.tokens_issued ?? "-"}
            </p>

            {application.rejection_reason && (
              <p>
                <strong>Rejection Reason:</strong>{" "}
                {application.rejection_reason}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationView;
