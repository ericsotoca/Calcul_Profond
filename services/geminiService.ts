
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

export const getAIRecommendation = async (profile: UserProfile): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string) });
  
  const prompt = `
    Analyze this Awale player profile and provide a 2-sentence pedagogical recommendation.
    Rank: ${profile.rank}
    XP: ${profile.xp}
    Success Rate: ${profile.stats.successRate}%
    Boot Time: ${profile.stats.bootTime}s
    Module Performance:
    - Flash-Scan: ${profile.stats.flashScan.successes}/${profile.stats.flashScan.attempts}
    - Distribution: ${profile.stats.distribution.successes}/${profile.stats.distribution.attempts}
    - Checksum: ${profile.stats.checksum.successes}/${profile.stats.checksum.attempts}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional Awale coach specialized in cognitive training and mental visualization. Be concise and encouraging.",
        temperature: 0.7,
      },
    });

    return response.text || "Continuez votre entraînement régulier pour stabiliser vos acquis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Concentrez-vous sur le module Flash-Scan pour réduire votre Boot Time.";
  }
};
