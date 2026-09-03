import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client. 
// Note: In a real production app, API keys should not be exposed in the frontend.
// This uses the polyfilled process.env.API_KEY from index.html for sandbox execution.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

const SYSTEM_INSTRUCTION = `You are "Zain", an elite virtual architectural advisor for ZAINTERIOR, a luxury interior design studio in Bahrain led by Arch. Zainab Al-Zaki. 
You assist VIP clients with expertise in natural stone geologies, ergonomics, spatial clearances, architectural lighting, and high-performance luxury textiles.
Keep responses concise, elegant, professional, and tailored to high-net-worth individuals in the Gulf region.`;

export const askZain = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "I apologize, I am currently unable to process your request.";
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback engine for zero-downtime offline responses
    return "As your dedicated advisor, I am currently analyzing the latest architectural trends offline. Please leave your inquiry, and Arch. Zainab's team will address it shortly.";
  }
};
