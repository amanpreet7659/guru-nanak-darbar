import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LanguageSwitcher from "../../components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "../../i18n";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      Swal.fire({
        icon: "warning",
        title: t("admin.usernameRequired"),
        text: t("admin.usernameRequiredText"),
      });
      return;
    }

    if (!form.password) {
      Swal.fire({
        icon: "warning",
        title: t("admin.passwordRequired"),
        text: t("admin.passwordRequiredText"),
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || t("admin.loginFailed"));
      }

      await Swal.fire({
        icon: "success",
        title: t("admin.loginSuccess"),
        text: t("admin.welcomeAdmin"),
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("admin.loginFailed"),
        text: error?.message || t("admin.invalidCreds"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <LanguageSwitcher variant="light" />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          maxWidth: "90%",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          {t("admin.loginTitle")}
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          {t("admin.orgName")}
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label>{t("admin.usernameEmail")}</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder={t("admin.enterUsername")}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "7px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label>{t("admin.password")}</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("admin.enterPassword")}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "7px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "6px",
            background: "#1f3c68",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? t("admin.loggingIn") : t("admin.login")}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "12px",
            border: "1px solid #d0d7e2",
            borderRadius: "6px",
            background: "#fff",
            color: "#1f3c68",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <i className="bi bi-arrow-left" aria-hidden="true" />
          {t("admin.backToHome")}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
