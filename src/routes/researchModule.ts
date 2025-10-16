import express, { Request, Response, NextFunction } from "express";
import mongoose, { Schema, Document } from "mongoose";

//
// ------------------- MODELS -------------------
//

// 1. Research Publication
interface IResearchPublication extends Document {
  title: string;
  authors: string[];
  date: Date;
  summary: string;
  category: string;
}
const ResearchPublicationSchema = new Schema<IResearchPublication>({
  title: { type: String, required: true },
  authors: [{ type: String }],
  date: { type: Date, default: Date.now },
  summary: { type: String },
  category: { type: String },
});
const ResearchPublication = mongoose.model<IResearchPublication>(
  "ResearchPublication",
  ResearchPublicationSchema
);

// 2. Research Focus Area
interface IResearchFocusArea extends Document {
  title: string;
  description: string;
}
const ResearchFocusAreaSchema = new Schema<IResearchFocusArea>({
  title: { type: String, required: true },
  description: { type: String },
});
const ResearchFocusArea = mongoose.model<IResearchFocusArea>(
  "ResearchFocusArea",
  ResearchFocusAreaSchema
);

// 3. Research Partnership
interface IResearchPartnership extends Document {
  partnerName: string;
  description: string;
  startDate: Date;
}
const ResearchPartnershipSchema = new Schema<IResearchPartnership>({
  partnerName: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, default: Date.now },
});
const ResearchPartnership = mongoose.model<IResearchPartnership>(
  "ResearchPartnership",
  ResearchPartnershipSchema
);

// 4. Research Participation
interface IResearchParticipation extends Document {
  userId: string;
  researchTitle: string;
  status: "pending" | "approved" | "rejected";
}
const ResearchParticipationSchema = new Schema<IResearchParticipation>({
  userId: { type: String, required: true },
  researchTitle: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
const ResearchParticipation = mongoose.model<IResearchParticipation>(
  "ResearchParticipation",
  ResearchParticipationSchema
);

// 5. Research Proposal
interface IResearchProposal extends Document {
  userId: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
}
const ResearchProposalSchema = new Schema<IResearchProposal>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});
const ResearchProposal = mongoose.model<IResearchProposal>(
  "ResearchProposal",
  ResearchProposalSchema
);

//
// ------------------- HELPERS -------------------
//
const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

//
// ------------------- ROUTER -------------------
//
const router = express.Router();

//
// ---------- Publications ----------
router.get(
  "/publications",
  asyncHandler(async (_req, res) => {
    const pubs = await ResearchPublication.find();
    res.json({ success: true, data: pubs });
  })
);

router.post(
  "/publications",
  asyncHandler(async (req, res) => {
    const pub = await ResearchPublication.create(req.body);
    res.status(201).json({ success: true, data: pub });
  })
);

router.put(
  "/publications/:id",
  asyncHandler(async (req, res) => {
    const pub = await ResearchPublication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pub) return res.status(404).json({ success: false, message: "Publication not found" });
    res.json({ success: true, data: pub });
  })
);

router.delete(
  "/publications/:id",
  asyncHandler(async (req, res) => {
    const pub = await ResearchPublication.findByIdAndDelete(req.params.id);
    if (!pub) return res.status(404).json({ success: false, message: "Publication not found" });
    res.json({ success: true, message: "Publication deleted" });
  })
);

//
// ---------- Focus Areas ----------
router.get(
  "/focus-areas",
  asyncHandler(async (_req, res) => {
    const areas = await ResearchFocusArea.find();
    res.json({ success: true, data: areas });
  })
);

router.post(
  "/focus-areas",
  asyncHandler(async (req, res) => {
    const area = await ResearchFocusArea.create(req.body);
    res.status(201).json({ success: true, data: area });
  })
);

router.put(
  "/focus-areas/:id",
  asyncHandler(async (req, res) => {
    const area = await ResearchFocusArea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!area) return res.status(404).json({ success: false, message: "Focus area not found" });
    res.json({ success: true, data: area });
  })
);

router.delete(
  "/focus-areas/:id",
  asyncHandler(async (req, res) => {
    const area = await ResearchFocusArea.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ success: false, message: "Focus area not found" });
    res.json({ success: true, message: "Focus area deleted" });
  })
);

//
// ---------- Partnerships ----------
router.get(
  "/partnerships",
  asyncHandler(async (_req, res) => {
    const parts = await ResearchPartnership.find();
    res.json({ success: true, data: parts });
  })
);

router.post(
  "/partnerships",
  asyncHandler(async (req, res) => {
    const part = await ResearchPartnership.create(req.body);
    res.status(201).json({ success: true, data: part });
  })
);

router.put(
  "/partnerships/:id",
  asyncHandler(async (req, res) => {
    const part = await ResearchPartnership.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!part) return res.status(404).json({ success: false, message: "Partnership not found" });
    res.json({ success: true, data: part });
  })
);

router.delete(
  "/partnerships/:id",
  asyncHandler(async (req, res) => {
    const part = await ResearchPartnership.findByIdAndDelete(req.params.id);
    if (!part) return res.status(404).json({ success: false, message: "Partnership not found" });
    res.json({ success: true, message: "Partnership deleted" });
  })
);

//
// ---------- Participation ----------
router.get(
  "/participations",
  asyncHandler(async (_req, res) => {
    const parts = await ResearchParticipation.find();
    res.json({ success: true, data: parts });
  })
);

router.post(
  "/participations",
  asyncHandler(async (req, res) => {
    const part = await ResearchParticipation.create(req.body);
    res.status(201).json({ success: true, data: part });
  })
);

router.put(
  "/participations/:id",
  asyncHandler(async (req, res) => {
    const part = await ResearchParticipation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!part) return res.status(404).json({ success: false, message: "Participation not found" });
    res.json({ success: true, data: part });
  })
);

//
// ---------- Proposals ----------
router.get(
  "/proposals",
  asyncHandler(async (_req, res) => {
    const props = await ResearchProposal.find();
    res.json({ success: true, data: props });
  })
);

router.post(
  "/proposals",
  asyncHandler(async (req, res) => {
    const prop = await ResearchProposal.create(req.body);
    res.status(201).json({ success: true, data: prop });
  })
);

router.put(
  "/proposals/:id",
  asyncHandler(async (req, res) => {
    const prop = await ResearchProposal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!prop) return res.status(404).json({ success: false, message: "Proposal not found" });
    res.json({ success: true, data: prop });
  })
);

router.delete(
  "/proposals/:id",
  asyncHandler(async (req, res) => {
    const prop = await ResearchProposal.findByIdAndDelete(req.params.id);
    if (!prop) return res.status(404).json({ success: false, message: "Proposal not found" });
    res.json({ success: true, message: "Proposal deleted" });
  })
);

//
// ------------------- EXPORT -------------------
export default router;
