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

const router = express.Router();

//
// ---------- Publications ----------
router.get("/publications", getPublications);
router.post("/publications", createPublication);
router.put("/publications/:id", updatePublication);
router.delete("/publications/:id", deletePublication);

//
// ---------- Focus Areas ----------
router.get("/focus-areas", getFocusAreas);
router.post("/focus-areas", createFocusArea);
router.put("/focus-areas/:id", updateFocusArea);
router.delete("/focus-areas/:id", deleteFocusArea);

//
// ---------- Partnerships ----------
router.get("/partnerships", getPartnerships);
router.post("/partnerships", createPartnership);
router.put("/partnerships/:id", updatePartnership);
router.delete("/partnerships/:id", deletePartnership);

//
// ---------- Participations ----------
router.get("/participations", getParticipations);
router.post("/participations", createParticipation);
router.put("/participations/:id", updateParticipation);

//
// ---------- Proposals ----------
router.get("/proposals", getProposals);
router.post("/proposals", createProposal);
router.put("/proposals/:id", updateProposal);
router.delete("/proposals/:id", deleteProposal);

export default router;
