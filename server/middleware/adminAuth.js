import { verifyAdminToken } from "../utils/token.js";

export const requireAdmin = (
  req,
  res,
  next
) => {
  try {
    const token =
      req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const admin =
      verifyAdminToken(token);

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired authentication token.",
    });
  }
};