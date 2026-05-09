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
      return (this as any)._cachedTrends;
    }

    const businessContext = getBusinessContext();
    const finalLocation = location === "Local Area" ? businessContext.restaurant.location : location;
    try {
      const response = await fetch('/api/ai/trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: { ...businessContext, location: finalLocation } }),
      });
      const data = await response.json();
      (this as any)._cachedTrends = data;
      return data;
    } catch (error) {
      console.error('AI Service Trends Error:', error);
      return {
        neuralHighlights: [],
        foodTrends: [],
        digitalIntelligence: [],
        digitalExperience: [],
        customerPsychology: [],
        marketPositioning: [],
        strategicActions: [],
        confidenceScore: 0
      };
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
    try {
      const response = await fetch('/api/ai/standaloneAudit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: { auditData } }),
      });
      return await response.json();
    } catch (error) {
      console.error('AI Service Standalone Audit Error:', error);
      throw error;
    }
  }
};
