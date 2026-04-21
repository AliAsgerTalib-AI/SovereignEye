import { TarotCard, TarotLineage, SpreadSchema } from './types';

export const LINEAGES = [
  {
    id: 'marsielle',
    name: 'Tarot de Marseille',
    description: 'A traditional European system focusing on primary archetypes and structural symmetry. Known for its historical depth and unadorned minor arcana.'
  },
  {
    id: 'rws',
    name: 'Rider-Waite-Smith',
    description: 'The world\'s most popular lineage. rich in esoteric symbolism and detailed narrative imagery across all 78 cards. Ideal for intuitive visual storytelling.'
  },
  {
    id: 'thoth',
    name: 'The Thoth System',
    description: 'A deeply occult and complex system based on the works of Aleister Crowley. It features intense geometric art and layered astrological correspondences.'
  }
];

export const SPREADS: SpreadSchema[] = [
  {
    id: 'chronological',
    name: 'Chronological',
    description: 'Explore the flow of time: Past, Present, and Future.',
    labels: ['Past', 'Present', 'Future']
  },
  {
    id: 'decision',
    name: 'Decision',
    description: 'Evaluating paths: Option A, Option B, and the Tie-Breaker.',
    labels: ['Option A', 'Option B', 'Tie-Breaker']
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    description: 'Identifying roots: Symptom, Root Cause, and Cure.',
    labels: ['Symptom', 'Root Cause', 'The Cure']
  },
  {
    id: 'internal',
    name: 'Internal',
    description: 'Self-reflection: Mind, Body, and Spirit.',
    labels: ['Mind', 'Body', 'Spirit']
  },
  {
    id: 'relational',
    name: 'Relational',
    description: 'Interpersonal dynamics: Your Stance, Their Stance, and The Bridge.',
    labels: ['Your Stance', 'Their Stance', 'The Bridge']
  },
  {
    id: 'action',
    name: 'Action-Oriented',
    description: 'Strategic guidance: Situation, Obstacle, and Advice.',
    labels: ['Situation', 'Obstacle', 'Advice']
  }
];

// Helper to generate minor arcana
const generateMinorArcana = (lineage: TarotLineage): TarotCard[] => {
  const suits: string[] = [];
  const suitNames: Record<string, string> = {
    cups: lineage === 'thoth' ? 'Cups' : 'Cups',
    pentacles: lineage === 'thoth' ? 'Disks' : (lineage === 'marsielle' ? 'Coins' : 'Pentacles'),
    swords: 'Swords',
    wands: 'Wands'
  };

  const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];
  if (lineage === 'thoth') {
    // Thoth court cards: Princess, Prince, Queen, Knight
    const thothRanks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Princess', 'Prince', 'Queen', 'Knight'];
    const cards: TarotCard[] = [];
    Object.keys(suitNames).forEach(suitKey => {
      thothRanks.forEach(rank => {
        cards.push({
          id: `${lineage}-${suitKey}-${rank.toLowerCase()}`,
          name: `${rank} of ${suitNames[suitKey]}`,
          meaning: `The minor arcana force of ${rank} in the ${suitNames[suitKey]} suit, reflected through the Thoth system.`,
          image: `https://picsum.photos/seed/classic-tarot-${lineage}-${rank}-${suitKey}/400/600`,
          arcana: 'minor'
        });
      });
    });
    return cards;
  }

  const cards: TarotCard[] = [];
  Object.keys(suitNames).forEach(suitKey => {
    ranks.forEach(rank => {
      cards.push({
        id: `${lineage}-${suitKey}-${rank.toLowerCase()}`,
        name: `${rank} of ${suitNames[suitKey]}`,
        meaning: `The minor arcana force of ${rank} in the ${suitNames[suitKey]} suit, reflected through the ${lineage} tradition.`,
        image: `https://picsum.photos/seed/classic-tarot-${lineage}-${rank}-${suitKey}/400/600`,
        arcana: 'minor'
      });
    });
  });
  return cards;
};

export const RWS_MAJOR: TarotCard[] = [
  { id: 'rws-0', name: 'The Fool', meaning: 'Innocence, new beginnings, free spirit.', image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg', arcana: 'major' },
  { id: 'rws-1', name: 'The Magician', meaning: 'Manifestation, resourcefulness, power.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg', arcana: 'major' },
  { id: 'rws-2', name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, subconscious.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg', arcana: 'major' },
  { id: 'rws-3', name: 'The Empress', meaning: 'Femininity, beauty, nature, abundance.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg', arcana: 'major' },
  { id: 'rws-4', name: 'The Emperor', meaning: 'Authority, structure, establishment.', image: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/RWS_Tarot_04_Emperor.jpg', arcana: 'major' },
  { id: 'rws-5', name: 'The Hierophant', meaning: 'Spiritual wisdom, tradition, institutions.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg', arcana: 'major' },
  { id: 'rws-6', name: 'The Lovers', meaning: 'Love, harmony, choices, values.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg', arcana: 'major' },
  { id: 'rws-7', name: 'The Chariot', meaning: 'Control, willpower, success, action.', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg', arcana: 'major' },
  { id: 'rws-8', name: 'Strength', meaning: 'Strength, courage, compassion.', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg', arcana: 'major' },
  { id: 'rws-9', name: 'The Hermit', meaning: 'Soul-searching, introspection, inner guidance.', image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg', arcana: 'major' },
  { id: 'rws-10', name: 'Wheel of Fortune', meaning: 'Good luck, karma, destiny, cycles.', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg', arcana: 'major' },
  { id: 'rws-11', name: 'Justice', meaning: 'Justice, fairness, truth, law.', image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg', arcana: 'major' },
  { id: 'rws-12', name: 'The Hanged Man', meaning: 'Pause, surrender, letting go, new perspectives.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg', arcana: 'major' },
  { id: 'rws-13', name: 'Death', meaning: 'Endings, change, transformation.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg', arcana: 'major' },
  { id: 'rws-14', name: 'Temperance', meaning: 'Balance, moderation, patience.', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg', arcana: 'major' },
  { id: 'rws-15', name: 'The Devil', meaning: 'Shadow self, attachment, restriction.', image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg', arcana: 'major' },
  { id: 'rws-16', name: 'The Tower', meaning: 'Sudden change, upheaval, revelation.', image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg', arcana: 'major' },
  { id: 'rws-17', name: 'The Star', meaning: 'Hope, faith, renewal, purpose.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg', arcana: 'major' },
  { id: 'rws-18', name: 'The Moon', meaning: 'Illusion, fear, anxiety, intuition.', image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg', arcana: 'major' },
  { id: 'rws-19', name: 'The Sun', meaning: 'Positivity, success, vitality, fun.', image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg', arcana: 'major' },
  { id: 'rws-20', name: 'Judgement', meaning: 'Judgement, rebirth, inner calling.', image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg', arcana: 'major' },
  { id: 'rws-21', name: 'The World', meaning: 'Completion, integration, achievement.', image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg', arcana: 'major' },
];

export const THOTH_MAJOR: TarotCard[] = [
  { id: 'th-0', name: 'The Fool', meaning: 'Spontaneous energy, divine madness.', image: 'https://picsum.photos/seed/classic-thoth-fool/400/600', arcana: 'major' },
  { id: 'th-1', name: 'The Magus', meaning: 'Communication, skill, wisdom, magic.', image: 'https://picsum.photos/seed/thoth-magus/400/600', arcana: 'major' },
  { id: 'th-2', name: 'The Priestess', meaning: 'Spiritual purity, the bridge between worlds.', image: 'https://picsum.photos/seed/thoth-priestess/400/600', arcana: 'major' },
  { id: 'th-3', name: 'The Empress', meaning: 'Love, beauty, creative expression.', image: 'https://picsum.photos/seed/thoth-empress/400/600', arcana: 'major' },
  { id: 'th-4', name: 'The Emperor', meaning: 'Order, law, leadership, ambition.', image: 'https://picsum.photos/seed/thoth-emperor/400/600', arcana: 'major' },
  { id: 'th-5', name: 'The Hierophant', meaning: 'Divine wisdom, tradition, inner teacher.', image: 'https://picsum.photos/seed/thoth-hierophant/400/600', arcana: 'major' },
  { id: 'th-6', name: 'The Lovers', meaning: 'Unity of opposites, choice, duality.', image: 'https://picsum.photos/seed/thoth-lovers/400/600', arcana: 'major' },
  { id: 'th-7', name: 'The Chariot', meaning: 'Triumph over self, the grail, holy quest.', image: 'https://picsum.photos/seed/thoth-chariot/400/600', arcana: 'major' },
  { id: 'th-8', name: 'Adjustment', meaning: 'Equilibrium, balance, nature\'s law.', image: 'https://picsum.photos/seed/thoth-adjustment/400/600', arcana: 'major' },
  { id: 'th-9', name: 'The Hermit', meaning: 'Wisdom, seeker of light, inner solitude.', image: 'https://picsum.photos/seed/thoth-hermit/400/600', arcana: 'major' },
  { id: 'th-10', name: 'Fortune', meaning: 'Cycles of destiny, karma, change.', image: 'https://picsum.photos/seed/thoth-fortune/400/600', arcana: 'major' },
  { id: 'th-11', name: 'Lust', meaning: 'Strength, passion, vital energy, ecstasy.', image: 'https://picsum.photos/seed/thoth-lust/400/600', arcana: 'major' },
  { id: 'th-12', name: 'The Hanged Man', meaning: 'Duty, self-sacrifice, rebirth, suspension.', image: 'https://picsum.photos/seed/thoth-hanged/400/600', arcana: 'major' },
  { id: 'th-13', name: 'Death', meaning: 'Transformation, putrefaction, release.', image: 'https://picsum.photos/seed/thoth-death/400/600', arcana: 'major' },
  { id: 'th-14', name: 'Art', meaning: 'Alchemy, integration, synthesis, fusion.', image: 'https://picsum.photos/seed/thoth-art/400/600', arcana: 'major' },
  { id: 'th-15', name: 'The Devil', meaning: 'Creative energy, pan, overcoming fear.', image: 'https://picsum.photos/seed/thoth-devil/400/600', arcana: 'major' },
  { id: 'th-16', name: 'The Tower', meaning: 'Destruction of ego, sudden liberation.', image: 'https://picsum.photos/seed/thoth-tower/400/600', arcana: 'major' },
  { id: 'th-17', name: 'The Star', meaning: 'Confidence, guidance, inspiration.', image: 'https://picsum.photos/seed/thoth-star/400/600', arcana: 'major' },
  { id: 'th-18', name: 'The Moon', meaning: 'The dark night of the soul, subconscious.', image: 'https://picsum.photos/seed/thoth-moon/400/600', arcana: 'major' },
  { id: 'th-19', name: 'The Sun', meaning: 'Clarity, success, liberation.', image: 'https://picsum.photos/seed/thoth-sun/400/600', arcana: 'major' },
  { id: 'th-20', name: 'The Aeon', meaning: 'Final decision, step forward, transition.', image: 'https://picsum.photos/seed/thoth-aeon/400/600', arcana: 'major' },
  { id: 'th-21', name: 'The Universe', meaning: 'Completion, the end of the quest, totality.', image: 'https://picsum.photos/seed/thoth-universe/400/600', arcana: 'major' },
];

export const MARSIELLE_MAJOR: TarotCard[] = [
  { id: 'tdm-0', name: 'Le Mat', meaning: 'The wanderer, unbound soul, beginnings.', image: 'https://picsum.photos/seed/tdm-mat/400/600', arcana: 'major' },
  { id: 'tdm-1', name: 'Le Bateleur', meaning: 'The magician, juggler, youthful potential.', image: 'https://picsum.photos/seed/tdm-bateleur/400/600', arcana: 'major' },
  { id: 'tdm-2', name: 'La Papesse', meaning: 'The High Priestess, hidden knowledge.', image: 'https://picsum.photos/seed/tdm-papesse/400/600', arcana: 'major' },
  { id: 'tdm-3', name: 'L\'Impératrice', meaning: 'The Empress, creative abundance, nature.', image: 'https://picsum.photos/seed/tdm-imperatrice/400/600', arcana: 'major' },
  { id: 'tdm-4', name: 'L\'Empereur', meaning: 'The Emperor, stability, worldly power.', image: 'https://picsum.photos/seed/tdm-empereur/400/600', arcana: 'major' },
  { id: 'tdm-5', name: 'Le Pape', meaning: 'The Hierophant, spiritual authority, law.', image: 'https://picsum.photos/seed/tdm-pape/400/600', arcana: 'major' },
  { id: 'tdm-6', name: 'L\'Amoureux', meaning: 'The Lovers, choice, path of the heart.', image: 'https://picsum.photos/seed/tdm-amoureux/400/600', arcana: 'major' },
  { id: 'tdm-7', name: 'Le Chariot', meaning: 'The Chariot, victory, determined movement.', image: 'https://picsum.photos/seed/tdm-chariot/400/600', arcana: 'major' },
  { id: 'tdm-8', name: 'La Justice', meaning: 'Justice, equilibrium, impartiality.', image: 'https://picsum.photos/seed/tdm-justice/400/600', arcana: 'major' },
  { id: 'tdm-9', name: 'L\'Ermite', meaning: 'The Hermit, inner light, measured wisdom.', image: 'https://picsum.photos/seed/tdm-ermite/400/600', arcana: 'major' },
  { id: 'tdm-10', name: 'La Roue de Fortune', meaning: 'Wheel of Fortune, fate, turning cycles.', image: 'https://picsum.photos/seed/tdm-wheel/400/600', arcana: 'major' },
  { id: 'tdm-11', name: 'La Force', meaning: 'Strength, inner courage, soft power.', image: 'https://picsum.photos/seed/tdm-force/400/600', arcana: 'major' },
  { id: 'tdm-12', name: 'Le Pendu', meaning: 'The Hanged Man, reverse view, waiting.', image: 'https://picsum.photos/seed/tdm-pendu/400/600', arcana: 'major' },
  { id: 'tdm-13', name: 'L\'Arcane sans Nom', meaning: 'Death, deep transformation, clearing.', image: 'https://picsum.photos/seed/tdm-death/400/600', arcana: 'major' },
  { id: 'tdm-14', name: 'Tempérance', meaning: 'Temperance, health, moderation, blending.', image: 'https://picsum.photos/seed/tdm-temperance/400/600', arcana: 'major' },
  { id: 'tdm-15', name: 'Le Diable', meaning: 'The Devil, raw power, earthly bounds.', image: 'https://picsum.photos/seed/tdm-devil/400/600', arcana: 'major' },
  { id: 'tdm-16', name: 'La Maison Dieu', meaning: 'The Tower, shock of truth, ego fall.', image: 'https://picsum.photos/seed/tdm-tower/400/600', arcana: 'major' },
  { id: 'tdm-17', name: 'L\'Étoile', meaning: 'The Star, humble hope, cosmic flow.', image: 'https://picsum.photos/seed/tdm-star/400/600', arcana: 'major' },
  { id: 'tdm-18', name: 'La Lune', meaning: 'The Moon, deep waters, instinct, dream.', image: 'https://picsum.photos/seed/tdm-moon/400/600', arcana: 'major' },
  { id: 'tdm-19', name: 'Le Soleil', meaning: 'The Sun, radiant joy, success, light.', image: 'https://picsum.photos/seed/tdm-sun/400/600', arcana: 'major' },
  { id: 'tdm-20', name: 'Le Jugement', meaning: 'Judgement, awakening, new call.', image: 'https://picsum.photos/seed/tdm-judgement/400/600', arcana: 'major' },
  { id: 'tdm-21', name: 'Le Monde', meaning: 'The World, realization, crowning grace.', image: 'https://picsum.photos/seed/tdm-world/400/600', arcana: 'major' },
];

export const getDeck = (lineage: TarotLineage): TarotCard[] => {
  switch (lineage) {
    case 'marsielle':
      return [...MARSIELLE_MAJOR, ...generateMinorArcana('marsielle')];
    case 'thoth':
      return [...THOTH_MAJOR, ...generateMinorArcana('thoth')];
    case 'rws':
    default:
      return [...RWS_MAJOR, ...generateMinorArcana('rws')];
  }
};
