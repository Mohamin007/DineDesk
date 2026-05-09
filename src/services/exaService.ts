/**
 * Exa API Client Service
 * Interacts with the backend proxy to perform market research.
 */

export interface ExaSearchResult {
  title: string;
  url: string;
  score?: number;
  publishedDate?: string;
  author?: string;
  text?: string;
  highlights?: string[];
}

export const exaService = {
  search: async (query: string, category?: string): Promise<ExaSearchResult[]> => {
    try {
      const response = await fetch('/api/exa/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, category }),
      });

      if (!response.ok) {
        throw new Error('Exa research failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Exa Service Error:', error);
      return [];
    }
  },

  getMarketIntelligence: async (cuisine: string, location: string) => {
    const query = `current restaurant pricing and food trends for ${cuisine} in ${location} 2024 2025`;
    return exaService.search(query, 'research paper');
  }
};
