import express from "express";
import {
  createEnterpriseSolution,
  getEnterpriseSolutions,
  getEnterpriseSolutionById,
  updateEnterpriseSolution,
  deleteEnterpriseSolution,
} from "../controllers/enterpriseController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize(["SuperAdmin"]), createEnterpriseSolution)
  .get( getEnterpriseSolutions);

router
  .route("/:id")
  .get( getEnterpriseSolutionById)
  .put(protect, authorize(["SuperAdmin"]), updateEnterpriseSolution)
  .delete(protect, authorize(["SuperAdmin"]), deleteEnterpriseSolution);

export default router;
