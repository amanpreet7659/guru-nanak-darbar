import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

if (!username || !email || !password) {
  throw new Error(
    "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
  );
}

const client = new MongoClient(uri);

try {
  await client.connect();

  const db = client.db("gurdwara");

  const collection = db.collection("admin_users");

  const existingAdmin = await collection.findOne({
    username,
  });

  if (existingAdmin) {
    console.log("Admin already exists.");

    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await collection.insertOne({
    name,
    username,
    email,
    password_hash: passwordHash,
    role: "admin",
    status: "Active",
    created_at: new Date(),
    updated_at: new Date(),
  });

  console.log("Admin created successfully.");
  console.log(`Username: ${username}`);
} catch (error) {
  console.error("Admin seed error:", error);
  process.exit(1);
} finally {
  await client.close();
}