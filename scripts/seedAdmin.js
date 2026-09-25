import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const name = process.env.ADMIN_NAME?.trim();
const username = process.env.ADMIN_USERNAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!name) {
  throw new Error("ADMIN_NAME is required");
}

if (!username) {
  throw new Error("ADMIN_USERNAME is required");
}

if (!email) {
  throw new Error("ADMIN_EMAIL is required");
}

if (!password) {
  throw new Error("ADMIN_PASSWORD is required");
}

if (password.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters");
}

const client = new MongoClient(uri);

try {
  console.log("Connecting to MongoDB...");

  await client.connect();

  console.log("MongoDB connected.");

  const db = client.db(process.env.DB_NAME || "sikh_virsa_sambhal_gurdwara");

  const collection = db.collection("admin_users");

  // --------------------------------------------------
  // Check if username OR email already exists
  // --------------------------------------------------

  const existingAdmin = await collection.findOne({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });

  if (existingAdmin) {
    console.log("======================================");
    console.log("Admin already exists.");
    console.log(
      `Username: ${existingAdmin.username || "N/A"}`
    );
    console.log(
      `Email: ${existingAdmin.email || "N/A"}`
    );
    console.log("======================================");

    process.exit(0);
  }

  // --------------------------------------------------
  // Hash password
  // --------------------------------------------------

  const passwordHash = await bcrypt.hash(password, 12);

  // --------------------------------------------------
  // Create admin
  // --------------------------------------------------

  const adminDocument = {
    name,

    username,

    email,

    password_hash: passwordHash,

    role: "admin",

    status: "Active",

    created_at: new Date(),

    updated_at: new Date(),
  };

  const result = await collection.insertOne(adminDocument);

  console.log("======================================");
  console.log("Admin created successfully.");
  console.log(`Admin ID: ${result.insertedId}`);
  console.log(`Name: ${name}`);
  console.log(`Username: ${username}`);
  console.log(`Email: ${email}`);
  console.log(`Role: admin`);
  console.log(`Status: Active`);
  console.log("======================================");
} catch (error) {
  console.error("Admin seed error:", error);

  process.exitCode = 1;
} finally {
  await client.close();

  console.log("MongoDB connection closed.");
}