import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnterpriseSolution extends Document {
  name: string;
  description: string;
  targetInstitutions: string[];
  features: string[];
  isWhiteLabel: boolean;
  hasAnalyticsDashboards: boolean;
  hasCohortTracking: boolean;
  minUsers?: number;
  contactSalesRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EnterpriseSolutionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    targetInstitutions: [{
      type: String,
      enum: ["NHS Trusts", "Deaneries", "Medical Schools", "Medical Institutions"]
    }],
    features: [{
      type: String,
      enum: ["GapMap", "InterviewSim", "CPD", "Analytics Dashboards", "Cohort Tracking", "White-label Branding"]
    }],
    isWhiteLabel: {
      type: Boolean,
      default: false
    },
    hasAnalyticsDashboards: {
      type: Boolean,
      default: false
    },
    hasCohortTracking: {
      type: Boolean,
      default: false
    },
    hasBulkusermanagement:{
      type:Boolean,
      default:false
    },
    minUsers: {
      type: Number,
      default: null
    },
    contactSalesRequired: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
EnterpriseSolutionSchema.index({ targetInstitutions: 1 });
EnterpriseSolutionSchema.index({ features: 1 });
EnterpriseSolutionSchema.index({ isWhiteLabel: 1 });

export const EnterpriseSolution: Model<IEnterpriseSolution> = mongoose.model<IEnterpriseSolution>(
  "EnterpriseSolution",
  EnterpriseSolutionSchema
);
