import { requireAdmin } from "../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const admin = requireAdmin(req, res);

  if (!admin) {
    return;
  }

  return res.status(200).json({
    success: true,
    data: admin,
  });
}