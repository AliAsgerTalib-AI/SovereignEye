import { UserDetails, TarotCard } from "../types";

export async function interpretSpread(
  userDetails: UserDetails,
  cards: { position: string, card: TarotCard }[]
): Promise<string> {
  const cardsSummary = cards.map(c => `- ${c.position}: ${c.card.name} (${c.card.meaning})`).join('\n');
  
  const prompt = `
    Act as an expert Tarot reader with 20 years of experience doing tarot predictions, at "SovereignEye". 
    
    [Protocol Activation]
    User: ${userDetails.name} (Age: ${userDetails.age})
    Question: "${userDetails.question}"
    Lineage: ${userDetails.lineage}
    Spread Pattern: ${userDetails.spreadType}
    
    [The Draw]
    ${cardsSummary}
    
    [Objective]
    Analyze the user's inquiry through the lens of the ${userDetails.lineage} tradition. 
    Synthesize the cards in their specific positions. 
    Incorporate the user's age (${userDetails.age}) to calibrate the depth and perspective of the advice.
    
    [Response Requirements]
    1. Acknowledge the selected spread and why it illuminates the inquiry.
    2. Provide a cohesive, mystical, and accurate interpretation.
    3. Conclude with "The Synthesis": a concise, resonant prediction not exceeding 200 words.
    
    Tone: Sophisticated, scholarly and deeply intuitive.
  `;

  try {
    const response = await fetch('/api/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('Server returned an error');
    
    const data = await response.json();
    return data.text || "The stars are silent for now. Try again later.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The veil is thick, and the spirits are elusive. Trust your own inner light.";
  }
}

export async function getCardDetails(card: TarotCard, userDetails: UserDetails): Promise<string> {
  const prompt = `
    Act as an expert Tarot reader with 20 years of experience doing tarot predictions, at "SovereignEye".
    User Inquiry: "${userDetails.question}"
    Card Being Explored: ${card.name}
    Lineage Foundation: ${userDetails.lineage}
    
    Provide an in-depth, nuanced, and scholarly analysis of this card's symbolism, historical significance, and spiritual resonance within the specific context of the ${userDetails.lineage} system. 
    Crucially, relate these deeper meanings to the user's specific inquiry: "${userDetails.question}". 
    Explore the visual archetypes and characteristic philosophies of the ${userDetails.lineage} tradition and how they specifically illuminate or challenge the user's path.
    Go beyond surface-level keywords to provide a "nuanced interpretation" that weaves together the deck's heritage and the seeker's current flux.
    
    Format your response as three distinct, sophisticated paragraphs.
    Tone:  academic yet intuitive, sophisticated, and deeply resonant.
  `;

  try {
    const response = await fetch('/api/card-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('Server returned an error');
    
    const data = await response.json();
    return data.text || "No further details available in the archive.";
  } catch (error) {
    console.error("Gemini Details Error:", error);
    return "Error retrieving nuanced archival data.";
  }
}
