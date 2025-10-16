import { Request, Response, NextFunction } from "express";
import {
  ResearchPublication,
  ResearchFocusArea,
  ResearchPartnership,
  ResearchParticipation,
  ResearchProposal,
} from "../models/researchModels";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

//
// ---------- Publications ----------
export const getPublications = asyncHandler(
  async (_req: Request, res: Response) => {
    const pubs = await ResearchPublication.find();
    res.json({ success: true, data: pubs });
  }
);

export const createPublication = asyncHandler(
  async (req: Request, res: Response) => {
    const pub = await ResearchPublication.create(req.body);
    res.status(201).json({ success: true, data: pub });
  }
);

export const updatePublication = asyncHandler(
  async (req: Request, res: Response) => {
    const pub = await ResearchPublication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pub) {
      return res
        .status(404)
        .json({ success: false, message: "Publication not found" });
    }
    res.json({ success: true, data: pub });
  }
);

export const deletePublication = asyncHandler(
  async (req: Request, res: Response) => {
    const pub = await ResearchPublication.findByIdAndDelete(req.params.id);
    if (!pub) {
      return res
        .status(404)
        .json({ success: false, message: "Publication not found" });
    }
    res.json({ success: true, message: "Publication deleted" });
  }
);

//
// ---------- Focus Areas ----------
export const getFocusAreas = asyncHandler(
  async (_req: Request, res: Response) => {
    const areas = await ResearchFocusArea.find();
    res.json({ success: true, data: areas });
  }
);

export const createFocusArea = asyncHandler(
  async (req: Request, res: Response) => {
    const area = await ResearchFocusArea.create(req.body);
    res.status(201).json({ success: true, data: area });
  }
);

export const updateFocusArea = asyncHandler(
  async (req: Request, res: Response) => {
    const area = await ResearchFocusArea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!area) {
      return res
        .status(404)
        .json({ success: false, message: "Focus area not found" });
    }
    res.json({ success: true, data: area });
  }
);

export const deleteFocusArea = asyncHandler(
  async (req: Request, res: Response) => {
    const area = await ResearchFocusArea.findByIdAndDelete(req.params.id);
    if (!area) {
      return res
        .status(404)
        .json({ success: false, message: "Focus area not found" });
    }
    res.json({ success: true, message: "Focus area deleted" });
  }
);

//
// ---------- Partnerships ----------
export const getPartnerships = asyncHandler(
  async (_req: Request, res: Response) => {
    const parts = await ResearchPartnership.find();
    res.json({ success: true, data: parts });
  }
);

export const createPartnership = asyncHandler(
  async (req: Request, res: Response) => {
    const part = await ResearchPartnership.create(req.body);
    res.status(201).json({ success: true, data: part });
  }
);

export const updatePartnership = asyncHandler(
  async (req: Request, res: Response) => {
    const part = await ResearchPartnership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Partnership not found" });
    }

    res.json({ success: true, data: part });
  }
);

export const deletePartnership = asyncHandler(
  async (req: Request, res: Response) => {
    const part = await ResearchPartnership.findByIdAndDelete(req.params.id);
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Partnership not found" });
    }
    res.json({ success: true, message: "Partnership deleted" });
  }
);

//
// ---------- Participations ----------
export const getParticipations = asyncHandler(
  async (_req: Request, res: Response) => {
    const parts = await ResearchParticipation.find();
    res.json({ success: true, data: parts });
  }
);

export const createParticipation = asyncHandler(
  async (req: Request, res: Response) => {
    const part = await ResearchParticipation.create(req.body);
    res.status(201).json({ success: true, data: part });
  }
);

export const updateParticipation = asyncHandler(
  async (req: Request, res: Response) => {
    const part = await ResearchParticipation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!part) {
      return res
        .status(404)
        .json({ success: false, message: "Participation not found" });
    }
    res.json({ success: true, data: part });
  }
);

//
// ---------- Proposals ----------
export const getProposals = asyncHandler(
  async (_req: Request, res: Response) => {
    const props = await ResearchProposal.find();
    res.json({ success: true, data: props });
  }
);

export const createProposal = asyncHandler(
  async (req: Request, res: Response) => {
    const prop = await ResearchProposal.create(req.body);
    res.status(201).json({ success: true, data: prop });
  }
);

export const updateProposal = asyncHandler(
  async (req: Request, res: Response) => {
    const prop = await ResearchProposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!prop) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }
    res.json({ success: true, data: prop });
  }
);

export const deleteProposal = asyncHandler(
  async (req: Request, res: Response) => {
    const prop = await ResearchProposal.findByIdAndDelete(req.params.id);
    if (!prop) {
      return res
        .status(404)
        .json({ success: false, message: "Proposal not found" });
    }
    res.json({ success: true, message: "Proposal deleted" });
  }
);
