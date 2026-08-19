import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();

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
        title: "Username Required",
        text: "Please enter your username.",
      });

      return;
    }

    if (!form.password) {
      Swal.fire({
        icon: "warning",
        title: "Password Required",
        text: "Please enter your password.",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Login failed."
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome to Admin Panel.",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/admin");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.message ||
          "Invalid username or password.",
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
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          maxWidth: "90%",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Admin Login
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Sikh Virsa Sambhal Sabha
        </p>

        <div style={{ marginBottom: "20px" }}>
          <label>Username / Email</label>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "7px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
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
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;