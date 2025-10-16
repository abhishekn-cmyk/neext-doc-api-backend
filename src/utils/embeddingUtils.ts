import { GoogleGenAI } from "@google/genai";
import { Job } from "./jobMatching";

const ai = new GoogleGenAI({});

export const getEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: [text],
    });

     return response.embeddings[0].values;
  } catch (error) {
    console.error("Error fetching embedding:", error);
    throw new Error("Failed to fetch embedding");
  }
};

export const searchEmbeddings = async (
  queryEmbedding: number[],

  jobs: (Job & { embedding: number[] })[],
  topK = 10
): Promise<(Job & { embedding: number[]; score: number })[]> => {
  const scoredJobs = jobs.map((job) => {
    const score = cosineSimilarity(queryEmbedding, job.embedding);
    return { ...job, score };
  });

  return scoredJobs.sort((a, b) => b.score - a.score).slice(0, topK);
};

const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length for cosine similarity.");
  }

  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
};
