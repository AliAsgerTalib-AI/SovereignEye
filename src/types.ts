export type TarotLineage = 'marsielle' | 'rws' | 'thoth';
export type TarotTheme = 'celestial-gold' | 'midnight-silver' | 'obsidian-crimson';

export type SpreadType = 'chronological' | 'decision' | 'diagnostic' | 'internal' | 'relational' | 'action';

export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  image: string;
  arcana: 'major' | 'minor';
}

export interface UserDetails {
  name: string;
  age: string;
  question: string;
  lineage: TarotLineage;
  cardTheme: TarotTheme;
  spreadType: SpreadType;
}

export interface CardPosition {
  card: TarotCard;
  label: string;
  insight: string;
  isRevealed: boolean;
}

export interface SpreadSchema {
  id: SpreadType;
  name: string;
  description: string;
  labels: string[];
}

export interface ReadingResult {
  cards: CardPosition[];
  spiritsAnswer: string;
}
