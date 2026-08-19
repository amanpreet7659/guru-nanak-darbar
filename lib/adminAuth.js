import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is missing");
}

export function createAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

export function verifyAdminToken(req) {
  try {
    const cookies = parseCookies(req.headers.cookie || "");

    const token = cookies.admin_token;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.trim().split("=");

    if (!name) {
      return cookies;
    }

    cookies[name] = decodeURIComponent(rest.join("="));

    return cookies;
  }, {});
}

export function requireAdmin(req, res) {
  const admin = verifyAdminToken(req);

  if (!admin) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Admin login required.",
    });

    return null;
  }

  return admin;
}