import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { createAdminToken } from "../../lib/adminAuth";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { username, password } = req.body || {};

    const loginValue = String(username || "").trim();

    if (!loginValue) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const client = await clientPromise;

    const db = client.db("gurdwara");

    const admin = await db
      .collection("admin_users")
      .findOne({
        $or: [
          {
            username: loginValue,
          },
          {
            email: loginValue.toLowerCase(),
          },
        ],
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive.",
      });
    }

    if (!admin.password_hash) {
      return res.status(500).json({
        success: false,
        message: "Admin password is not configured.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // IMPORTANT:
    // Never put the complete MongoDB admin document
    // inside the JWT/cookie.
    const tokenPayload = {
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role || "Admin",
    };

    const token = createAdminToken(tokenPayload);

    if (!token) {
      throw new Error("Failed to create admin token.");
    }

    const isProduction =
      process.env.NODE_ENV === "production";

    const cookie = [
      `admin_token=${encodeURIComponent(token)}`,
      "HttpOnly",
      "Path=/",
      "Max-Age=86400",
      "SameSite=Lax",
      isProduction ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");

    res.setHeader("Set-Cookie", cookie);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: admin._id,
        name: admin.name || "",
        username: admin.username,
        email: admin.email || "",
        role: admin.role || "Admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}