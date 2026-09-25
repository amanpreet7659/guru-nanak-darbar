import clientPromise from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/adminAuth";

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

  try {
    const {
      status,
      program_year,
      search,
      page = "1",
      limit = "20",
    } = req.query;
    console.log("Admin applications query:", req.query);
    const client = await clientPromise;

    const db = client.db("gurdwara");

    const collection = db.collection("waheguru_simran_registrations");

    const filter = {};

    // =========================
    // STATUS FILTER
    // =========================

    if (status) {
      const decodedStatus = decodeURIComponent(
        String(status).replace(/\+/g, " "),
      ).trim();

      if (decodedStatus) {
        filter.status = decodedStatus;
      }
    }

    // =========================
    // PROGRAM YEAR FILTER
    // =========================

    if (program_year) {
      filter.program_year = Number(program_year);
    }

    // =========================
    // SEARCH FILTER
    // =========================

    if (search) {
      const searchValue = String(search).trim();

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
            registration_id: {
              $regex: searchValue,
              $options: "i",
            },
          },
          {
            _id: {
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

    const currentPage = Math.max(Number(page) || 1, 1);

    const currentLimit = Math.min(Math.max(Number(limit) || 20, 1), 10000);

    const skip = (currentPage - 1) * currentLimit;

    // =========================
    // DEBUG
    // =========================

    console.log("Admin Applications Filter:", JSON.stringify(filter));

    // =========================
    // COUNT
    // =========================

    const total = await collection.countDocuments(filter);

    // =========================
    // APPLICATIONS
    // =========================

    const applications = await collection
      .find(filter)
      .sort({
        created_at: -1,
      })
      .skip(skip)
      .limit(currentLimit)
      .toArray();

    return res.status(200).json({
      success: true,

      data: applications,

      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    });
  } catch (error) {
    console.error("Admin applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
