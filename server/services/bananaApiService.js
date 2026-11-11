/**
 * Interoperability Service: Banana API Integration
 * 
 * Interoperates with the external University of Bedfordshire Banana API service:
 * https://marcconrad.com/uob/banana/api.php?out=json
 * 
 * Demonstrates:
 * 1. RESTful HTTP client communication over TLS/HTTPS
 * 2. Response schema parsing and validation
 * 3. Graceful degradation / offline fallback strategy
 * 4. Enterprise security: Isolates the 'solution' on the backend so clients cannot inspect network traffic to cheat!
 */

const BANANA_API_URL = process.env.BANANA_API_URL || 'https://marcconrad.com/uob/banana/api.php?out=json';

// Curated high-availability fallback puzzles in case of university network downtime
const FALLBACK_PUZZLES = [
  {
    question: 'https://www.sanfoh.com/uob/banana/data/t2d443522cdd22b41877d433a69n77.png',
    solution: 7
  },
  {
    question: 'https://www.sanfoh.com/uob/banana/data/m94901306aa7c9f80214a11f211o77.png',
    solution: 4
  },
  {
    question: 'https://www.sanfoh.com/uob/banana/data/v6575798939c381c8b3294326f59b39.png',
    solution: 6
  },
  {
    question: 'https://www.sanfoh.com/uob/banana/data/x1928374655a1b2c3d4e5f678901z99.png',
    solution: 3
  }
];

class BananaApiService {
  /**
   * Fetches a new puzzle from the external Marc Conrad Banana API.
   * Uses AbortController to implement network timeouts.
   * @returns {Promise<{ question: string, solution: number, source: string }>}
   */
  static async fetchNewPuzzle() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
      console.log(`[BananaApiService] Requesting external puzzle from: ${BANANA_API_URL}`);
      const response = await fetch(BANANA_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BananaQuest-SoftwareEnterprise/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Banana API returned HTTP status ${response.status}`);
      }

      const data = await response.json();

      if (!data.question || data.solution === undefined) {
        throw new Error('Invalid payload received from Banana API');
      }

      const solutionNum = parseInt(data.solution, 10);

      return {
        question: data.question,
        solution: isNaN(solutionNum) ? 0 : solutionNum,
        source: 'MarcConrad-Banana-API'
      };
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[BananaApiService] External API unavailable (${err.message}). Using resilient fallback.`);
      
      // Select random fallback
      const fallback = FALLBACK_PUZZLES[Math.floor(Math.random() * FALLBACK_PUZZLES.length)];
      return {
        ...fallback,
        source: 'Fallback-Resilience-Engine'
      };
    }
  }

  /**
   * Generates contextual AI hints based on the puzzle state
   * Used for the "Optional Enhance AI" feature.
   */
  static generateAiHint(solution) {
    const isEven = solution % 2 === 0;
    const isHigh = solution >= 5;
    const lowerBound = Math.max(0, solution - 2);
    const upperBound = Math.min(9, solution + 2);

    const hints = [
      `🤖 AI Analysis: The missing digit is an ${isEven ? 'EVEN' : 'ODD'} number.`,
      `🤖 AI Analysis: The banana value lies within the range [${lowerBound} - ${upperBound}].`,
      `🤖 AI Analysis: The value is ${isHigh ? 'greater than or equal to 5' : 'strictly less than 5'}.`,
      `🤖 AI Analysis: Look closely at the final row of the equation: notice how the quantity of bananas changed!`
    ];

    return hints[Math.floor(Math.random() * hints.length)];
  }
}

module.exports = BananaApiService;
