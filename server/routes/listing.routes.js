import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createListing);
router.delete("/delete/:id", protectRoute, deleteListing);
router.post("/update/:id", protectRoute, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
