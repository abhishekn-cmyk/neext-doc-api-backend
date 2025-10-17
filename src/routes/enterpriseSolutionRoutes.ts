import express from "express";
import {
  createEnterpriseSolution,
  getEnterpriseSolutions,
  getEnterpriseSolutionById,
  updateEnterpriseSolution,
  deleteEnterpriseSolution,
} from "../controllers/enterpriseController";

const router = express.Router();

router
  .route("/")
  .post(createEnterpriseSolution) // removed protect & authorize
  .get(getEnterpriseSolutions);

router
  .route("/:id")
  .get(getEnterpriseSolutionById)
  .put(updateEnterpriseSolution) // removed protect & authorize
  .delete(deleteEnterpriseSolution); // removed protect & authorize

export default router;
