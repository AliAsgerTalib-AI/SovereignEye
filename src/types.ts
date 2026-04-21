export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  image: string;
}

export interface UserDetails {
  name: string;
  dob: string;
  question: string;
}

export interface CardPosition {
  card: TarotCard;
  label: 'Past' | 'Present' | 'Future';
  insight: string;
}

export interface ReadingResult {
  cards: CardPosition[];
  spiritsAnswer: string;
}
