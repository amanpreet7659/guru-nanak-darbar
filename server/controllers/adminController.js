import bcrypt from "bcryptjs";

import AdminUser from "../models/AdminUser.js";
import WaheguruRegistration from "../models/WaheguruRegistration.js";

import { createAdminToken } from "../utils/token.js";

// =====================================================
// ADMIN LOGIN
// =====================================================

export const loginAdmin = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body || {};

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

    const admin = await AdminUser.findOne({
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
        message:
          "Invalid username or password.",
      });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message:
          "Admin account is inactive.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid username or password.",
      });
    }

    const token =
      createAdminToken(admin);

    // =========================
    // COOKIE
    // =========================

    const cookieOptions = [
      `admin_token=${encodeURIComponent(
        token
      )}`,
      "HttpOnly",
      "Path=/",
      "Max-Age=86400",
      "SameSite=Lax",
    ];

    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      cookieOptions.push("Secure");
    }

    res.setHeader(
      "Set-Cookie",
      cookieOptions.join("; ")
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
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// =====================================================
// ADMIN LOGOUT
// =====================================================

export const logoutAdmin = async (req, res) => {
  try {
    const cookieOptions = [
      "admin_token=",
      "HttpOnly",
      "Path=/",
      "Max-Age=0",
      "SameSite=Lax",
    ];

    if (process.env.NODE_ENV === "production") {
      cookieOptions.push("Secure");
    }

    res.setHeader("Set-Cookie", cookieOptions.join("; "));

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================================
// ADMIN ME (session check)
// =====================================================

export const getAdminMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        id: req.admin?.id,
        username: req.admin?.username,
        email: req.admin?.email,
        role: req.admin?.role,
      },
    });
  } catch (error) {
    console.error("Admin me error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================================
// GET APPLICATIONS
// =====================================================

export const getApplications = async (
  req,
  res
) => {
  try {
    const {
      status,
      program_year,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // =========================
    // STATUS
    // =========================

    if (status) {
      const decodedStatus =
        decodeURIComponent(
          String(status).replace(
            /\+/g,
            " "
          )
        ).trim();

      if (decodedStatus) {
        filter.status =
          decodedStatus;
      }
    }

    // =========================
    // PROGRAM YEAR
    // =========================

    if (program_year) {
      const year = Number(
        program_year
      );

      if (!Number.isNaN(year)) {
        filter.program_year = year;
      }
    }

    // =========================
    // SEARCH
    // =========================

    if (search) {
      const searchValue =
        String(search).trim();

      if (searchValue) {
        filter.$or = [
          {
            full_name: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            mobile_number: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            email: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            registration_id: {
              $regex: searchValue,
              $options: "i",
            },
          },
        ];
      }
    }

    // =========================
    // PAGINATION
    // =========================

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const currentLimit = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    const skip =
      (currentPage - 1) *
      currentLimit;

    // =========================
    // COUNT
    // =========================

    const total =
      await WaheguruRegistration.countDocuments(
        filter
      );

    // =========================
    // DATA
    // =========================

    const applications =
      await WaheguruRegistration.find(
        filter
      )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean();

    return res.status(200).json({
      success: true,

      data: applications,

      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages:
          Math.ceil(
            total / currentLimit
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// =====================================================
// GET SINGLE APPLICATION
// =====================================================

export const getApplication = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Application ID is required.",
      });
    }

    const application =
      await WaheguruRegistration.findById(
        id
      ).lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

export const updateApplicationStatus =
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        status,
        verified_count,
        tokens_issued,
        notes,
      } = req.body || {};

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Application ID is required.",
        });
      }

      const allowedStatuses = [
        "Registered",
        "Pending Verification",
        "Accepted",
        "Rejected",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status.",
        });
      }

      const updateData = {
        status,
      };

      // =========================
      // VERIFIED COUNT
      // =========================

      if (
        verified_count !==
        undefined
      ) {
        updateData.verified_count =
          Number(
            verified_count
          );
      }

      // =========================
      // TOKENS
      // =========================

      if (
        tokens_issued !==
        undefined
      ) {
        updateData.tokens_issued =
          Number(
            tokens_issued
          );
      }

      // =========================
      // NOTES
      // =========================

      if (
        notes !== undefined
      ) {
        updateData.notes =
          String(notes).trim();
      }

      const application =
        await WaheguruRegistration.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        ).lean();

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application updated successfully.",
        data: application,
      });
    } catch (error) {
      console.error(
        "Update application error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal server error.",
      });
    }
  };