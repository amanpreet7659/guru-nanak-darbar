import mongoose from "mongoose";

const waheguruRegistrationSchema = new mongoose.Schema(
  {
    registration_id: {
      type: String,
      required: true,
      unique: true,
    },

    program_year: {
      type: Number,
      required: true,
    },

    full_name: {
      type: String,
      required: true,
      trim: true,
    },

    father_husband_name: {
      type: String,
      default: "",
      trim: true,
    },

    mobile_number: {
      type: String,
      required: true,
      trim: true,
    },

    whatsapp_number: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    village_city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    preferred_language: {
      type: String,
      enum: ["en", "pa"],
      default: "en",
    },

    copies_submitted: {
      type: Number,
      default: 0,
    },

    submitted_count: {
      type: Number,
      default: null,
    },

    submission_date: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    verified_count: {
      type: Number,
      default: null,
    },

    tokens_issued: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Registered",
        "Pending Verification",
        "Accepted",
        "Rejected",
      ],
      default: "Registered",
    },
  },
  {
    timestamps: true,
  }
);

waheguruRegistrationSchema.index(
  {
    mobile_number: 1,
    program_year: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "waheguru_simran_registrations",
  waheguruRegistrationSchema
);