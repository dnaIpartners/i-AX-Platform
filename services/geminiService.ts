import { GoogleGenAI, Type } from "@google/genai";
import { RFPAnalysis } from "../types";
import { getActiveGeminiKey } from "./keyService";

/**
 * Helper to get a fresh Gemini client with the latest key.
 * This ensures we use the key from localStorage if it's updated.
 */
const getClient = () => {
  const apiKey = getActiveGeminiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes the raw RFP text and returns a structured JSON object.
 */
export const analyzeRFP = async (rfpText: string): Promise<RFPAnalysis> => {
  const prompt = `
    You are an expert Senior Technical Project Manager and Software Architect.
    Analyze the following Request for Proposal (RFP) text for a website/web application construction project.
    
    Extract the key details and structure them according to the requested schema.
    If specific details (like Client Name) are missing, infer a generic name or state "Unknown".
    Provide a professional estimation for the tech stack if not explicitly mandated.
    Identify potential risks based on vague requirements or aggressive timelines.
    
    RFP Content:
    """
    ${rfpText}
    """
  `;

  const response = await getClient().models.generateContent({
    model: "gemini-3-pro-preview", // Using Pro for complex reasoning and extraction
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          projectTitle: { type: Type.STRING, description: "The likely title of the project" },
          clientName: { type: Type.STRING, description: "Name of the issuer" },
          executiveSummary: { type: Type.STRING, description: "A 2-3 sentence summary of the project goals" },
          keyObjectives: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 primary business goals"
          },
          recommendedTechStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested technologies (e.g., React, Node.js, AWS)"
          },
          functionalRequirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Key features required (e.g., CMS, User Auth, Payment)"
          },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                risk: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                mitigation: { type: Type.STRING }
              }
            }
          },
          projectPhases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseName: { type: Type.STRING },
                duration: { type: Type.STRING, description: "Estimated duration (e.g., '2 weeks')" },
                deliverables: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          estimatedBudgetRange: { type: Type.STRING, description: "A rough estimation string based on scope complexity" }
        },
        required: ["projectTitle", "executiveSummary", "keyObjectives", "recommendedTechStack", "risks", "projectPhases"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as RFPAnalysis;
  }
  throw new Error("Failed to generate analysis");
};

/**
 * Chat with the RFP document context or generic chat.
 */
export const chatWithRFP = async (
  rfpText: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[], 
  newMessage: string
) => {
  let systemInstruction = '';
  
  if (rfpText && rfpText.trim().length > 0) {
    systemInstruction = `
      You are a helpful assistant for a proposal team. 
      You have access to the following RFP document. 
      Answer the user's questions strictly based on the provided RFP text.
      If the information is not in the RFP, say so clearly.
      
      RFP Context:
      """
      ${rfpText}
      """
    `;
  } else {
    systemInstruction = `
      You are a helpful, professional AI assistant for i-Partners, a digital agency specialized in AX (AI Experience).
      You assist users with web development strategies, creative insights, data analysis, and general consulting.
      Be concise, professional, and helpful. Use Korean language.
    `;
  }

  const chatSession = getClient().chats.create({
    model: "gemini-3-flash-preview", // Flash is faster for chat
    config: {
      systemInstruction: systemInstruction,
    },
    history: history
  });

  const result = await chatSession.sendMessage({ message: newMessage });
  return result.text;
};