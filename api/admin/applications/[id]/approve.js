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

    const {
      verified_count,
    } = req.body || {};

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const count = Number(verified_count);

    if (
      !Number.isFinite(count) ||
      count < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid verified count is required.",
      });
    }

    const tokensIssued = Math.floor(
      count / 1000
    );

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
            verified_count: count,
            tokens_issued: tokensIssued,
            status: "Approved",
            verified_by: admin.username,
            verified_at: new Date(),
            updated_at: new Date(),
          },
        },
        {
          returnDocument: "after",
        }
      );

    return res.status(200).json({
      success: true,
      message: "Application approved successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Application approval error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}