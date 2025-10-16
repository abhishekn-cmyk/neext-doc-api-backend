import { getEmbedding, searchEmbeddings } from "./embeddingUtils";

export interface Job {
  id: string;
  title: string;
  location: string;
  level: string;
  visaSponsorship: boolean;
  description: string;
  applyUrl: string;
}

const allJobsWithEmbeddings: (Job & { embedding: number[] })[] = [];

const mapProfileToQuery = (profile: any) => {
  const jp = profile.jobPreferences;
  const visa = profile.visaInfo;
  return `
    Job Specialty: ${jp.targetSpecialty || ""}
    Role Level: ${jp.targetRoleLevel || ""}
    Locations: ${(jp.preferredLocations || []).join(",")}
    Work Pattern: ${jp.workPatternPreference || ""}
    Visa Status: ${visa.currentVisaStatus || ""}
    Previous UK Sponsorship: ${visa.previousUKSponsorship || ""}
  `;
};

export const fetchJobMatches = async (profile: any) => {
  const query = mapProfileToQuery(profile);

  const queryEmbedding = await getEmbedding(query);

  const matchedJobs: Job[] = await searchEmbeddings(
    queryEmbedding,
    allJobsWithEmbeddings,
    10
  );

  const results = matchedJobs.map((job) => {
    let score = 50;
    if (profile.jobPreferences.targetRoleLevel === job.level) score += 20;
    if (profile.jobPreferences.targetSpecialty === job.title) score += 20;

    if (profile.visaInfo.currentVisaStatus === "tier2" && job.visaSponsorship)
      score += 10;
    return { ...job, fitScore: Math.min(score, 100) };
  });

  return results;
};
