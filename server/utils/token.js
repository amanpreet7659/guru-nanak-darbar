import jwt from "jsonwebtoken";

export const createAdminToken = (
  admin
) => {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    {
      id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    secret,
    {
      expiresIn: "1d",
    }
  );
};

export const verifyAdminToken = (
  token
) => {
  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.verify(
    token,
    secret
  );
};