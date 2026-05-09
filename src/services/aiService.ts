/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from '@/lib/firebase';
import { dataService } from './dataService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AnalysisReport {
  summary: string;
  efficiencyScore: number;
  wasteRiskScore: number;
  retentionScore: number;
  growthPotentialScore: number;
  keyInsights: string[];
  revenueOpportunities: string[];
  menuSuggestions: string[];
  demandForecast: string;
  competitorAnalysis: string;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'optimization' | 'alert' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface MarketIntelligence {
  neuralHighlights: string[];
  foodTrends: { title: string; description: string; momentum: 'high' | 'medium' | 'low' }[];
  digitalIntelligence: { title: string; platform: string; insight: string }[];
  digitalExperience: { feature: string; impact: string; recommendation: string }[];
  customerPsychology: { title: string; description: string; segment: string }[];
  marketPositioning: { title: string; description: string }[];
  strategicActions: { action: string; impact: string; target: string }[];
  confidenceScore: number;
}

export interface MarketTrend {
  item: string;
  type: 'menu' | 'market' | 'consumer';
  growth: string;
  reason: string;
  action: string;
}

const createEmptyMarketIntelligence = (): MarketIntelligence => ({
  neuralHighlights: [],
  foodTrends: [],
  digitalIntelligence: [],
  digitalExperience: [],
  customerPsychology: [],
  marketPositioning: [],
  strategicActions: [],
  confidenceScore: 0,
});

const normalizeMarketIntelligence = (payload: any): MarketIntelligence => ({
  neuralHighlights: Array.isArray(payload?.neuralHighlights) ? payload.neuralHighlights.filter((item: any) => typeof item === 'string') : [],
  foodTrends: Array.isArray(payload?.foodTrends) ? payload.foodTrends.filter(Boolean) : [],
  digitalIntelligence: Array.isArray(payload?.digitalIntelligence) ? payload.digitalIntelligence.filter(Boolean) : [],
  digitalExperience: Array.isArray(payload?.digitalExperience) ? payload.digitalExperience.filter(Boolean) : [],
  customerPsychology: Array.isArray(payload?.customerPsychology) ? payload.customerPsychology.filter(Boolean) : [],
  marketPositioning: Array.isArray(payload?.marketPositioning) ? payload.marketPositioning.filter(Boolean) : [],
  strategicActions: Array.isArray(payload?.strategicActions) ? payload.strategicActions.filter(Boolean) : [],
  confidenceScore: Number.isFinite(Number(payload?.confidenceScore)) ? Number(payload.confidenceScore) : 0,
});

const getBusinessContext = () => {
  try {
    const userKey = auth.currentUser?.email || JSON.parse(sessionStorage.getItem('demo_user') || '{}').email || '';
    const storageKey = userKey ? `onboarding_data_${userKey}` : 'onboarding_data';
    const onboardingData = sessionStorage.getItem(storageKey);
    const b = onboardingData ? JSON.parse(onboardingData) : null;
    
    const operationalContext = dataService.getOperationalContext();
    
    return {
      owner: {
        name: b?.ownerName || "Operator",
        role: b?.ownerRole || "Executive"
      },
      restaurant: {
        name: b?.restaurantName || "Unconfigured Restaurant",
        type: b?.businessType || "Casual Dining",
        cuisine: b?.cuisine || "General Cuisine",
        location: b?.city || "Unknown Location",
        locationsCount: b?.locationsCount || "1",
        seatingCapacity: b?.seatingCapacity || "N/A"
      },
      operations: {
        dailyOrders: b?.avgDailyOrders || "N/A",
        revenueTarget: b?.monthlyRevenue || "N/A",
        staffCount: b?.teamSize || 8,
        deliveryPlatforms: b?.deliveryPlatforms || [],
        peakHours: b?.peakHours || "N/A",
        ...operationalContext.stats // Inject real-time stats
      },
      menu: {
        categories: b?.menuCategories || "General",
        signatureItems: b?.signatureItems || "Standard Menu",
        pricingStyle: b?.pricingStyle || "Balanced",
        inventory_items: operationalContext.menu // Direct access to menu items
      },
      inventory: operationalContext.inventory, // Direct access to stock levels
      challenges: {
        inventory: b?.inventoryChallenges || "Standard tracking",
        operational: b?.operationalPainPoints || "General efficiency"
      },
      goals: {
        primary: b?.businessGoals || "Growth",
        target: b?.growthTarget || "Scale",
        analyticsFocus: b?.preferredAnalytics || "Revenue Monitoring"
      },
      activeModule: window.location.pathname,
      platformCapabilities: [
        "Executive Overview",
        "Live Orders",
        "Menu Intelligence",
        "AI Inventory",
        "CRM & Loyalty",
        "Market Trends",
        "Intelligence Reports"
      ]
    };
  } catch (e) {
    return {
      restaurant: { name: "Enterprise OS", location: "Global" },
      metrics: { dailyRevenue: 0 }
    };
  }
};

export const aiService = {
  async fetchJsonWithTimeout(url: string, init: RequestInit, timeoutMs = 90000): Promise<Response> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      window.clearTimeout(timeout);
    }
  },

  async chat(messages: ChatMessage[], sessionContext: any = null): Promise<string> {
    const businessContext = getBusinessContext();
    const finalContext = {
      ...businessContext,
      ...sessionContext,
    };
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, context: finalContext }),
      });
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('AI Service Chat Error:', error);
      throw error;
    }
  },

  async getInsights(context: any = null): Promise<{ insights: AIInsight[] }> {
    const finalContext = context || getBusinessContext();
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: finalContext }),
      });
      const data = await response.json();
      return { insights: data.insights || [] };
    } catch (error) {
      console.error('AI Service Insights Error:', error);
      return { insights: [] };
    }
  },

  async getTrends(location: string = "Local Area", forceRefresh: boolean = false): Promise<MarketIntelligence> {
    if (!forceRefresh && (this as any)._cachedTrends) {
      return normalizeMarketIntelligence((this as any)._cachedTrends);
    }

    const businessContext = getBusinessContext();
    const finalLocation = location === "Local Area" ? businessContext.restaurant.location : location;
    try {
      const response = await this.fetchJsonWithTimeout('/api/ai/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: { ...businessContext, location: finalLocation } }),
      });

      if (!response.ok) {
        throw new Error(`Trends request failed with status ${response.status}`);
      }

      const data = await response.json();
      const normalized = normalizeMarketIntelligence(data);
      (this as any)._cachedTrends = normalized;
      return normalized;
    } catch (error) {
      console.error('AI Service Trends Error:', error);
      return createEmptyMarketIntelligence();
    }
  },

  async getExecutiveReport(type: string = "executive", context: any = null): Promise<any> {
    const finalContext = context || getBusinessContext();
    try {
      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: finalContext, type: type }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI Service Report Error:', error);
      throw error;
    }
  },

  async analyzeRestaurant(restaurantData: any): Promise<AnalysisReport> {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantData }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI Service Analysis Error:', error);
      throw error;
    }
  },

  async ask(prompt: string, module: string = 'chat', context: any = null): Promise<string> {
    const businessContext = getBusinessContext();
    const finalContext = {
      ...businessContext,
      ...(context || {}),
    };
    try {
      const response = await fetch(`/api/ai/${module}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: prompt }], 
          context: finalContext 
        }),
      });
      const data = await response.json();
      return data.message || JSON.stringify(data);
    } catch (error) {
      console.error(`AI Service ${module} Error:`, error);
      throw error;
    }
  },

  async getPredictiveAlerts(): Promise<any[]> {
    const finalContext = getBusinessContext();
    try {
      const response = await fetch('/api/ai/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: finalContext }),
      });
      const data = await response.json();
      return Array.isArray(data) ? data : (data.alerts || []);
    } catch (error) {
      console.error('AI Service Alerts Error:', error);
      return [];
    }
  },

  async getFutureProofAnalysis(): Promise<any> {
    const finalContext = getBusinessContext();
    try {
      const response = await fetch('/api/ai/futureProof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: finalContext }),
      });
      return await response.json();
    } catch (error) {
      console.error('AI Service Future Proof Error:', error);
      throw error;
    }
  },

  async runStandaloneAudit(auditData: any): Promise<any> {
    const fallbackReport = {
      overallScore: 52,
      scores: {
        digital: 48,
        alignment: 54,
        genZ: 50,
        growth: 56,
      },
      verdict: 'The strategic scan completed with a fallback analysis because the live AI engine was unavailable. The business shows workable growth potential, but the digital and audience-alignment layers need sharper execution.',
      positioning: {
        analysis: 'This is a conservative fallback assessment derived from the submitted business profile.',
        strengths: ['Clear business inputs captured', 'Defined growth intent', 'Reusable operating framework'],
        weaknesses: ['Live AI synthesis unavailable', 'Market context could not be fully resolved', 'Digital readiness needs confirmation'],
      },
      digitalAudit: {
        status: 'Evolving',
        analysis: 'The scan could not complete live digital synthesis, so this is a safe fallback assessment.',
        recommendations: ['Reconnect the AI service and rerun the scan', 'Verify Exa and Groq credentials', 'Confirm the deployment API route is available'],
      },
      futureReadiness: {
        score: 53,
        analysis: 'The business is directionally viable, but future-readiness should be validated with a successful live analysis pass.',
        modernizationSteps: ['Rerun neural scan', 'Refresh market intelligence inputs', 'Review digital conversion funnels'],
      },
      genZAnalysis: {
        score: 50,
        analysis: 'Audience resonance could not be fully synthesized from live data, so this remains a provisional score.',
        compatibilityLevel: 'Medium',
      },
      strategy: [
        { title: 'Restore live AI synthesis', description: 'Verify the backend route and AI credentials so the final report can be generated from live signals.', impact: 'High' },
        { title: 'Validate market inputs', description: 'Recheck the source business data for completeness before rerunning the scan.', impact: 'High' },
        { title: 'Improve digital readiness', description: 'Use the final report to prioritize digital channels, social presence, and conversion hygiene.', impact: 'Exponential' },
      ],
      error: 'Live AI analysis was unavailable, so this fallback report was shown instead.'
    };

    try {
      const response = await this.fetchJsonWithTimeout('/api/ai/standaloneAudit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: { auditData } }),
      });

      if (!response.ok) {
        throw new Error(`Standalone audit failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Standalone audit returned an invalid payload');
      }

      return data;
    } catch (error) {
      console.error('AI Service Standalone Audit Error:', error);
      return fallbackReport;
    }
  }
};
