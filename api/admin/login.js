import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import { createAdminToken } from "../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { username, password } = req.body || {};

    if (!username?.trim()) {
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

    const admin = await db.collection("admin_users").findOne({
      $or: [
        {
          username: username.trim(),
        },
        {
          email: username.trim().toLowerCase(),
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

    const token = createAdminToken(admin);

    res.setHeader(
      "Set-Cookie",
      `admin_token=${encodeURIComponent(
        token
      )}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${
        process.env.NODE_ENV === "production" ? "; Secure" : ""
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role,
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