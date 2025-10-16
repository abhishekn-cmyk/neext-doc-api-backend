import mongoose, { Document, Schema, Model } from "mongoose";

export interface IAbout extends Document {
  title: string; // e.g. "About NextDoc Global"
  description: string; // general intro paragraph

  mission: {
    title: string;
    description: string;
    icon?: string;
  };

  vision: {
    title: string;
    description: string;
    icon?: string;
  };

  whyChoose: {
    title: string;
    subtitle?: string;
    items: {
      title: string;
      description: string;
      icon?: string;
    }[];
  };

  researchAndDevelopment: {
    title: string;
    subtitle?: string;
    items: {
      title: string;
      description: string;
      icon?: string;
    }[];
  };

  values: {
    title: string;
    items: {
      title: string;
      description: string;
      icon?: string;
    }[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    mission: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: String,
    },

    vision: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: String,
    },

    whyChoose: {
      title: { type: String, required: true },
      subtitle: String,
      items: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: String,
        },
      ],
    },

    researchAndDevelopment: {
      title: { type: String },
      subtitle: String,
      items: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: String,
        },
      ],
    },

    values: {
      title: { type: String },
      items: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
          icon: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);

export default About;
