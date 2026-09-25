import WaheguruRegistration from "../models/WaheguruRegistration.js";

const getProgramYear = (program_year) =>
  Number(program_year) || new Date().getFullYear();

// =====================================================
// STEP 1: START REGISTRATION
// =====================================================

export const createRegistration = async (req, res) => {
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
      notes,
      preferred_language,
    } = req.body || {};

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

    const selectedLanguage =
      preferred_language === "pa" ? "pa" : "en";

    const currentProgramYear = getProgramYear(program_year);
    const normalizedMobile = mobile_number.trim();
    const normalizedEmail = email?.trim().toLowerCase() || "";

    const existingRegistration = await WaheguruRegistration.findOne({
      mobile_number: normalizedMobile,
      program_year: currentProgramYear,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number has already been registered for this program year.",
      });
    }

    if (normalizedEmail) {
      const existingEmail = await WaheguruRegistration.findOne({
        email: normalizedEmail,
        program_year: currentProgramYear,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message:
            "This email has already been registered for this program year.",
        });
      }
    }

    const registrationId = `WS-${currentProgramYear}-${Date.now()}`;

    const registration = await WaheguruRegistration.create({
      registration_id: registrationId,
      program_year: currentProgramYear,
      full_name: full_name.trim(),
      father_husband_name: father_husband_name?.trim() || "",
      mobile_number: normalizedMobile,
      whatsapp_number: whatsapp_number?.trim() || "",
      email: normalizedEmail,
      village_city: village_city.trim(),
      address: address?.trim() || "",
      age: age ? Number(age) : null,
      gender: gender || "",
      pincode: pincode?.trim() || "",
      preferred_language: selectedLanguage,
      copies_submitted: 0,
      submitted_count: null,
      submission_date: "",
      notes: notes?.trim() || "",
      verified_count: null,
      tokens_issued: null,
      status: "Registered",
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Use your mobile number or email later to submit your Waheguru count.",
      data: registration,
    });
  } catch (error) {
    console.error("Create registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This mobile number has already been registered for this program year.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// =====================================================
// STEP 2: SUBMIT SIMRAN COUNT
// =====================================================

export const submitApplication = async (req, res) => {
  try {
    const {
      program_year,
      user_id,
      mobile_number,
      email,
      copies_submitted,
      submitted_count,
      submission_date,
      notes,
    } = req.body || {};

    const identifier = String(
      user_id || mobile_number || email || ""
    ).trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Mobile number or email (User ID) is required.",
      });
    }

    if (!submitted_count || Number(submitted_count) < 1) {
      return res.status(400).json({
        success: false,
        message: "Waheguru count is required.",
      });
    }

    if (!copies_submitted || Number(copies_submitted) < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of copies submitted is required.",
      });
    }

    if (!submission_date) {
      return res.status(400).json({
        success: false,
        message: "Submission date is required.",
      });
    }

    const deadline = process.env.SIMRAN_SUBMISSION_DEADLINE;

    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();

      if (
        !Number.isNaN(deadlineDate.getTime()) &&
        today > deadlineDate
      ) {
        return res.status(403).json({
          success: false,
          message:
            "The application submission deadline has passed. Please contact the admin.",
        });
      }
    }

    const currentProgramYear = getProgramYear(program_year);
    const isEmail = identifier.includes("@");

    const registration = await WaheguruRegistration.findOne(
      isEmail
        ? {
            email: identifier.toLowerCase(),
            program_year: currentProgramYear,
          }
        : {
            mobile_number: identifier,
            program_year: currentProgramYear,
          }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message:
          "No registration found for this User ID. Please register first.",
      });
    }

    if (registration.status === "Accepted") {
      return res.status(409).json({
        success: false,
        message:
          "This application has already been accepted and cannot be updated.",
      });
    }

    if (registration.status === "Rejected") {
      return res.status(409).json({
        success: false,
        message:
          "This application was rejected. Please contact the admin.",
      });
    }

    registration.copies_submitted = Number(copies_submitted);
    registration.submitted_count = Number(submitted_count);
    registration.submission_date = submission_date;
    registration.notes = notes?.trim() || registration.notes || "";
    registration.status = "Pending Verification";

    await registration.save();

    return res.status(200).json({
      success: true,
      message:
        "Application submitted successfully. Waiting for admin verification.",
      data: registration,
    });
  } catch (error) {
    console.error("Submit application error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
