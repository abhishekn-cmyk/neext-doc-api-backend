import express from "express";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getFocusAreas,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  getPartnerships,
  createPartnership,
  updatePartnership,
  deletePartnership,
  getParticipations,
  createParticipation,
  updateParticipation,
  getProposals,
  createProposal,
  updateProposal,
  deleteProposal,
} from "../controllers/researchController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/roleMiddleware";

const router = express.Router();

//
// ---------- Publications (Admin only for CRUD, User can only view) ----------
router.get("/publications",  getPublications);
router.post("/publications", protect, authorize(["SuperAdmin"]), createPublication);
router.put("/publications/:id", protect, authorize(["SuperAdmin"]), updatePublication);
router.delete("/publications/:id", protect, authorize(["SuperAdmin"]), deletePublication);

//
// ---------- Focus Areas ----------
router.get("/focus-areas",  getFocusAreas);
router.post("/focus-areas", protect, authorize(["SuperAdmin"]), createFocusArea);
router.put("/focus-areas/:id", protect, authorize(["SuperAdmin"]), updateFocusArea);
router.delete("/focus-areas/:id", protect, authorize(["SuperAdmin"]), deleteFocusArea);

//
// ---------- Partnerships ----------
router.get("/partnerships",  getPartnerships);
router.post("/partnerships", protect, authorize(["SuperAdmin"]), createPartnership);
router.put("/partnerships/:id", protect, authorize(["SuperAdmin"]), updatePartnership);
router.delete("/partnerships/:id", protect, authorize(["SuperAdmin"]), deletePartnership);

//
// ---------- Participations (Users can create, view their own; Admin full control) ----------
router.get("/participations", protect, authorize(["SuperAdmin"]), getParticipations); // Admin can see all
router.post("/participations", protect, authorize(["User", "SuperAdmin"]), createParticipation);
router.put("/participations/:id", protect, authorize(["SuperAdmin"]), updateParticipation);

//
// ---------- Proposals (Users can submit, Admin reviews) ----------
router.get("/proposals", protect, authorize(["SuperAdmin"]), getProposals); // Admin sees all proposals
router.post("/proposals", protect, authorize(["User", "SuperAdmin"]), createProposal);
router.put("/proposals/:id", protect, authorize(["SuperAdmin"]), updateProposal);
router.delete("/proposals/:id", protect, authorize(["SuperAdmin"]), deleteProposal);

export default router;
