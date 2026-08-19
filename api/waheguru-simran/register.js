import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({
        success: false,
        message: "Method Not Allowed",
      });
  }

  try {
    const {
      program_year,
      full_name,
      father_husband_name,
      mobile_number,
      whatsapp_number,
      email,
      village_city,
      address,
      age,
      gender,
      pincode,
      copies_submitted,
      submitted_count,
      submission_date,
      notes,
    } = req.body;

    // ============================================
    // BASIC VALIDATION
    // ============================================

    if (!full_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!mobile_number?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    if (!village_city?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Village / City is required.",
      });
    }

    if (!submitted_count) {
      return res.status(400).json({
        success: false,
        message: "Waheguru count is required.",
      });
    }

    if (!program_year) {
      return res.status(400).json({
        success: false,
        message: "Program year is required.",
      });
    }

    // ============================================
    // NORMALIZE VALUES
    // ============================================

    const normalizedMobile =
      mobile_number.trim();

    const normalizedProgramYear =
      Number(program_year);

    // ============================================
    // CONNECT TO DATABASE
    // ============================================

    const client = await clientPromise;

    const db = client.db("gurdwara");

    const collection = db.collection(
      "waheguru_simran_registrations"
    );

    // ============================================
    // CHECK DUPLICATE REGISTRATION
    // Same Mobile + Same Program Year
    // ============================================

    const existingRegistration =
      await collection.findOne({
        mobile_number: normalizedMobile,
        program_year: normalizedProgramYear,
      });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number has already been registered for the current program year.",
      });
    }

    // ============================================
    // GENERATE REGISTRATION NUMBER
    // ============================================

    const registrationId =
      `WS-${new Date().getFullYear()}-${Date.now()}`;

    // ============================================
    // CREATE DOCUMENT
    // ============================================

    const document = {
      registration_id: registrationId,

      program_year:
        normalizedProgramYear,

      full_name:
        full_name.trim(),

      father_husband_name:
        father_husband_name?.trim() || "",

      mobile_number:
        normalizedMobile,

      whatsapp_number:
        whatsapp_number?.trim() || "",

      email:
        email?.trim() || "",

      village_city:
        village_city.trim(),

      address:
        address?.trim() || "",

      age:
        age ? Number(age) : null,

      gender:
        gender || "",

      pincode:
        pincode?.trim() || "",

      copies_submitted:
        Number(copies_submitted),

      submitted_count:
        Number(submitted_count),

      submission_date,

      notes:
        notes?.trim() || "",

      verified_count: null,

      tokens_issued: null,

      status:
        "Pending Verification",

      created_at:
        new Date(),

      updated_at:
        new Date(),
    };

    // ============================================
    // INSERT
    // ============================================

    const result =
      await collection.insertOne(
        document
      );

    // ============================================
    // SUCCESS RESPONSE
    // ============================================

    return res.status(201).json({
      success: true,

      message:
        "Registration submitted successfully.",

      data: {
        ...document,
        _id: result.insertedId,
      },
    });

  } catch (error) {
    console.error(
      "Waheguru registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
}