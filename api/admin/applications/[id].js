import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  console.log(
    "Application API called:",
    req.method,
    req.query
  );

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

  try {
    const { id } = req.query;

    console.log(
      "Application ID:",
      id
    );

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required.",
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const client = await clientPromise;

    const db = client.db("gurdwara");

    const collection =
      db.collection(
        "waheguru_simran_registrations"
      );

    const application =
      await collection.findOne({
        _id: new ObjectId(id),
      });

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
        "Application fetched successfully.",
      data: application,
    });
  } catch (error) {
    console.error(
      "Application view error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
}   