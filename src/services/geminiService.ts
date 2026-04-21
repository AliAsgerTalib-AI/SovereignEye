import { GoogleGenAI } from "@google/genai";
import { UserDetails, TarotCard, CardPosition } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function interpretSpread(
  userDetails: UserDetails,
  cards: { position: 'Past' | 'Present' | 'Future', card: TarotCard }[]
): Promise<string> {
  const prompt = `
    You are an expert Tarot reader at "The Celestial Archive". 
    User Name: ${userDetails.name}
    User Question: "${userDetails.question}"
    
    Spread:
    - Past: ${cards[0].card.name} (${cards[0].card.meaning})
    - Present: ${cards[1].card.name} (${cards[1].card.meaning})
    - Future: ${cards[2].card.name} (${cards[2].card.meaning})
    
    Provide a cohesive, mystical, and encouraging interpretation of this spread in relation to the user's question. 
    Write exactly one paragraph as "The Spirits' Answer". 
    Tone: Sophisticated, ethereal, and intuitive.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "The stars are silent for now. Try again later.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The veil is thick, and the spirits are elusive. Trust your own inner light.";
  }
}
