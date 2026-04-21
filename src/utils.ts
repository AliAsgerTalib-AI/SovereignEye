/**
 * Fisher-Yates Shuffle using Web Crypto API for high-entropy randomness.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Generate a random index j such that 0 <= j <= i
    const j = getRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Returns a random integer in [0, max) using Web Crypto API.
 */
function getRandomInt(max: number): number {
  if (max <= 0) return 0;
  
  const array = new Uint32Array(1);
  const maxUint32 = Math.pow(2, 32);
  const range = max;
  const limit = maxUint32 - (maxUint32 % range);
  
  let randomValue: number;
  do {
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= limit);
  
  return randomValue % range;
}
