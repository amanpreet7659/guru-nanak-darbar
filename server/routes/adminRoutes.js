import express from "express";

import {
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  getApplications,
  getApplication,
  updateApplicationStatus,
} from "../controllers/adminController.js";

import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/logout", logoutAdmin);

router.get("/me", requireAdmin, getAdminMe);

router.get("/applications", requireAdmin, getApplications);

router.get("/applications/:id", requireAdmin, getApplication);

router.patch("/applications/:id/status", requireAdmin, updateApplicationStatus);

export default router;
