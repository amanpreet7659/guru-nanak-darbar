export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  res.setHeader(
    "Set-Cookie",
    "admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}