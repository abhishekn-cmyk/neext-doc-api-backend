import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { EnterpriseSolution } from "../models/Trust";

// @desc    Create a new Enterprise Solution
// @route   POST /api/enterprise-solutions
// @access  SuperAdmin
export const createEnterpriseSolution = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      description,
      targetInstitutions,
      features,
      isWhiteLabel,
      hasAnalyticsDashboards,
      hasCohortTracking,
      hasBulkUserManagement,
      minUsers,
      contactSalesRequired,
    } = req.body;

    const solution = new EnterpriseSolution({
      name,
      description,
      targetInstitutions,
      features,
      isWhiteLabel,
      hasAnalyticsDashboards,
      hasCohortTracking,
      hasBulkUserManagement,
      minUsers,
      contactSalesRequired,
    });

    const createdSolution = await solution.save();

    res.status(201).json({ success: true, data: createdSolution });
  }
);

// @desc    Get all Enterprise Solutions
// @route   GET /api/enterprise-solutions
// @access  SuperAdmin | User
export const getEnterpriseSolutions = asyncHandler(
  async (req: Request, res: Response) => {
    const solutions = await EnterpriseSolution.find();

    res.status(200).json({ success: true, data: solutions });
  }
);

// @desc    Get a single Enterprise Solution by ID
// @route   GET /api/enterprise-solutions/:id
// @access  SuperAdmin | User
export const getEnterpriseSolutionById = asyncHandler(
  async (req: Request, res: Response) => {
    const solution = await EnterpriseSolution.findById(req.params.id);

    if (!solution) {
      res
        .status(404)
        .json({ success: false, message: "Enterprise Solution not found" });
      return;
    }

    res.status(200).json({ success: true, data: solution });
  }
);

// @desc    Update an Enterprise Solution
// @route   PUT /api/enterprise-solutions/:id
// @access  SuperAdmin
export const updateEnterpriseSolution = asyncHandler(
  async (req: Request, res: Response) => {
    const solution = await EnterpriseSolution.findById(req.params.id);

    if (!solution) {
      res
        .status(404)
        .json({ success: false, message: "Enterprise Solution not found" });
      return;
    }

    Object.assign(solution, req.body);

    const updatedSolution = await solution.save();

    res.status(200).json({ success: true, data: updatedSolution });
  }
);

// @desc    Delete an Enterprise Solution
// @route   DELETE /api/enterprise-solutions/:id
// @access  SuperAdmin
export const deleteEnterpriseSolution = asyncHandler(
  async (req: Request, res: Response) => {
    const solution = await EnterpriseSolution.findByIdAndDelete(req.params.id);

    if (!solution) {
      res
        .status(404)
        .json({ success: false, message: "Enterprise Solution not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Enterprise Solution deleted" });
  }
);
