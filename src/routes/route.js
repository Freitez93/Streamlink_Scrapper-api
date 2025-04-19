import express from "express";
import { welcome } from "../controllers/welcome";
import { providers_list } from "../controllers/providers_list";
import { getSource } from "../controllers/getSource";

const router = express.Router();

// Endpoint: Welcome
router.get("/", welcome);
router.get("/api", welcome);

// Endpoint: Get providers list
router.get("/api/getSource/providers", providers_list)

// Endpoint: Get sources for a provider
router.get("/api/getSource/:provider", getSource);

export default router;