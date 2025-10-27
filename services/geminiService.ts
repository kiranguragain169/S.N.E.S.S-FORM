
import { GoogleGenAI } from "@google/genai";

export const generateStudentBio = async (firstName: string, lastName: string, major: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a short, optimistic, and engaging student bio (2-3 sentences) for a student named ${firstName} ${lastName} who is majoring in ${major}. The bio should be suitable for a university welcome page. Focus on their passion for their field and future aspirations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating student bio:", error);
    return "Failed to generate bio. Please try again.";
  }
};
