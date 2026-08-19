import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import { requireAdmin } from "../../../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  const admin = requireAdmin(req, res);

  if (!admin) {
    return;
  }

  try {
    const { id } = req.query;

    const { reason } = req.body || {};

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    if (!reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }

    const client = await clientPromise;

    const db = client.db("gurdwara");

    const collection = db.collection(
      "waheguru_simran_registrations"
    );

    const existing =
      await collection.findOne({
        _id: new ObjectId(id),
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const result =
      await collection.findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            status: "Rejected",
            rejection_reason: reason.trim(),
            rejected_by: admin.username,
            rejected_at: new Date(),
            updated_at: new Date(),
          },
        },
        {
          returnDocument: "after",
        }
      );

    return res.status(200).json({
      success: true,
      message: "Application rejected successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Application rejection error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}