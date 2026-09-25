import express from "express";

import {
  createRegistration,
  submitApplication,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/register", createRegistration);
router.post("/submit", submitApplication);

export default router;
