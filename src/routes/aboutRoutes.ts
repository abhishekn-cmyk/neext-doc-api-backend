import express from "express";
import aboutController from "../controllers/aboutController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router.get("/",  aboutController.getAbouts);
router.get("/:id", protect, authorize(["User", "SuperAdmin"]), aboutController.getAboutById);
router.post("/", protect, authorize(["SuperAdmin"]), aboutController.createAbout);
router.put("/:id", protect, authorize(["SuperAdmin"]), aboutController.updateAbout);
router.delete("/:id", protect, authorize(["SuperAdmin"]), aboutController.deleteAbout);

export default router;
